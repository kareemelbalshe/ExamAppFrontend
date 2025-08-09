import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionDto } from '../../models/dtos/question/question-dto';
import { Exam } from '../../models/exam';
import { QuestionService } from '../../services/question/question-service';
import { ExamService } from '../../services/exam.service';
import { ConfirmService } from '../../services/confirm.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Answer } from '../../services/answer/answer';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './take-exam.html',
  styleUrls: ['./take-exam.css'],
})
export class TakeExam implements OnInit, OnDestroy {
  examId = 1;
  questions: QuestionDto[] = [];
  isLoading = false;
  error = '';
  exam?: Exam;
  totalSeconds: number = 0;
  remainingSeconds: number = 0;
  dashOffset: number = 0;
  displayTime: string = '';
  intervalId: any;
  color: string = '#28a745';
  choices: { [questionId: number]: number } = {};
  currentIndex: number = 0;
  isTimerStarted: boolean = false;

  constructor(
    private questionsService: QuestionService,
    private examService: ExamService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private confirmService: ConfirmService,
    private toastService: ToastService,
    private answerService: Answer
  ) {}

  ngOnInit() {
    document.addEventListener('contextmenu', this.disableContextMenu);
    document.body.classList.add('no-select');
    this.enterFullscreen();

    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', () => {
      history.pushState(null, document.title, location.href);
    });

    this.route.params.subscribe((params) => {
      this.examId = +params['examId'];
      this.loadExam();
      this.loadQuestions();
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('contextmenu', this.disableContextMenu);
    document.body.classList.remove('no-select');
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  disableContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (['Escape', 'F11', 'F5'].includes(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  preventReload(event: BeforeUnloadEvent) {
    event.preventDefault();
    event.returnValue = false;
  }

  enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.log('Error entering fullscreen:', err);
      });
    } else if ((<any>elem).webkitRequestFullscreen) {
      (<any>elem).webkitRequestFullscreen();
    } else if ((<any>elem).msRequestFullscreen) {
      (<any>elem).msRequestFullscreen();
    }
  }

  loadExam() {
    this.isLoading = true;
    this.examService.getExamById(this.examId).subscribe({
      next: (exam) => {
        this.exam = exam;
        this.isLoading = false;

        if (this.exam?.startTime && this.exam?.endTime) {
          this.startTimer();
        } else {
          console.error('Exam start time or end time is missing');
          this.error = 'Exam timing information is not available';
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading exam:', err);
        this.error = 'Failed to load exam';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadQuestions() {
    this.isLoading = true;
    this.questionsService
      .getQuestionsByExamIdWithChoices(this.examId)
      .subscribe({
        next: (response) => {
          let responseQuestions = response?.data?.$values || [];
          this.questions = Array.isArray(responseQuestions)
            ? responseQuestions.map((q: any) => {
                q.choices = q?.choices?.$values || [];
                return q;
              })
            : [];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading questions:', err);
          this.error = 'Failed to load questions';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  startTimer() {
    if (this.isTimerStarted) return;

    if (!this.exam?.startTime || !this.exam?.endTime) {
      console.error('Cannot start timer: missing start or end time');
      return;
    }

    try {
      const now = new Date();
      const start = new Date(this.exam.startTime);
      const end = new Date(this.exam.endTime);

      this.totalSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
      this.remainingSeconds = Math.floor(
        (end.getTime() - now.getTime()) / 1000
      );

      if (this.remainingSeconds <= 0) {
        console.log('User entered after official exam time. Allowing exam.');
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        return;
      }

      if (now < start) {
        console.log('Exam has not started yet');
        this.error = 'The exam has not started yet';
        return;
      }

      this.isTimerStarted = true;

      this.updateDisplay();
      this.intervalId = setInterval(() => {
        this.remainingSeconds--;

        if (this.remainingSeconds <= 0) {
          this.remainingSeconds = 0;
          this.clearTimer();

          this.toastService.show(
            'The exam has ended. your answers will be submitted automatically.',
            'info',
            3000
          );

          this.submitExam(true);
          return;
        }

        this.updateDisplay();
      }, 1000);
    } catch (error) {
      console.error('Error starting timer:', error);
      this.error = 'An error occurred while starting the timer';
    }
  }

  updateDisplay() {
    if (this.totalSeconds === 0) return;

    const percentage = Math.max(0, this.remainingSeconds / this.totalSeconds);

    const circumference = 2 * Math.PI * 45;
    this.dashOffset = circumference * (1 - percentage);

    const minutes = Math.floor(Math.abs(this.remainingSeconds) / 60);
    const seconds = Math.abs(this.remainingSeconds) % 60;
    this.displayTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    if (percentage < 0.1) {
      this.color = '#dc3545';
    } else if (percentage < 0.25) {
      this.color = '#ffc107';
    } else {
      this.color = '#667eea';
    }

    setTimeout(() => {
      const timerContainer = document.querySelector('.timer-circle-container');
      if (timerContainer) {
        timerContainer.classList.remove('warning', 'danger');
        if (percentage < 0.1) {
          timerContainer.classList.add('danger');
        } else if (percentage < 0.25) {
          timerContainer.classList.add('warning');
        }
      }
    }, 0);
  }

  get currentQuestion(): QuestionDto | undefined {
    return this.questions[this.currentIndex];
  }

  goToQuestion(index: number) {
    if (index >= 0 && index < this.questions.length) {
      this.currentIndex = index;
    }
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  submitExam(autoSubmit: boolean = false) {
    this.clearTimer();

    if (autoSubmit) {
      this.submitConfirmed();
    } else {
      this.confirmService.show(
        'Confirm Submission',
        'Are you sure you want to submit the exam?',
        this.submitConfirmed
      );
    }
  }

  submitConfirmed = () => {
    const resultId = +localStorage.getItem('resultId')!;

    if (!resultId) {
      console.error('Result ID not found in localStorage');
      this.error = 'Error: Result ID not found';
      return;
    }

    const resultsToSubmit = Object.entries(this.choices).map(
      ([questionIdStr, choiceId]) => ({
        resultId: resultId,
        questionId: +questionIdStr,
        choiceId: +choiceId,
      })
    );

    console.log('Submitting answers:', resultsToSubmit);

    this.answerService.createAnswer(resultsToSubmit).subscribe({
      next: (res: any) => {
        console.log('Exam submitted successfully:', res);

        if (document.fullscreenElement) {
          document.exitFullscreen().catch((err) => {
            console.log('Error exiting fullscreen:', err);
          });
        }

        localStorage.removeItem('resultId');
        this.router.navigate([`/show-result/${res.data.id}`]);
      },
      error: (err) => {
        console.error('Error submitting answer:', err);
        this.error = 'An error occurred while submitting the exam';
      },
    });
  };
}
