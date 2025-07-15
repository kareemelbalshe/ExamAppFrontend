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

  constructor(
    private questionsService: QuestionService,
    private examService: ExamService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private confirmService: ConfirmService,
    private answerService: Answer
  ) {}

  ngOnInit() {
    // 🛡️ حماية من الخروج أو الرجوع
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
    clearInterval(this.intervalId);
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
      elem.requestFullscreen();
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
        this.startTimer();
        this.cdr.detectChanges();
      },
      error: (err) => {
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
        error: () => {
          this.error = 'Failed to load questions';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  startTimer() {
    if (!this.exam?.startTime || !this.exam?.endTime) return;

    const now = new Date();
    const start = new Date(this.exam.startTime);
    const end = new Date(this.exam.endTime);

    this.totalSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    this.remainingSeconds = Math.floor((end.getTime() - now.getTime()) / 1000);

    this.updateDisplay();
    this.intervalId = setInterval(() => {
      this.remainingSeconds--;
      if (this.remainingSeconds <= 0) {
        this.remainingSeconds = 0;
        clearInterval(this.intervalId);
        this.submitExam(); // ⏰ انتهى الوقت
      }
      this.updateDisplay();
    }, 1000);
  }

  updateDisplay() {
    const percentage = this.remainingSeconds / this.totalSeconds;
    const circumference = 2 * Math.PI * 45;
    this.dashOffset = circumference * (1 - percentage);

    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    this.displayTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    if (percentage < 0.2) this.color = '#dc3545';
    else if (percentage < 0.5) this.color = '#ffc107';
    else this.color = '#28a745';
  }

  get currentQuestion(): QuestionDto | undefined {
    return this.questions[this.currentIndex];
  }

  goToQuestion(index: number) {
    this.currentIndex = index;
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    } else {
      this.submitExam();
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  submitExam() {
    this.confirmService.show(
      'Confirm Submit',
      'Are you sure you want to submit your exam?',
      this.submitConfirmed
    );
  }

  submitConfirmed = () => {
    const resultId = +localStorage.getItem('resultId')!;
    const resultsToSubmit = Object.entries(this.choices).map(
      ([questionIdStr, choiceId]) => ({
        resultId: resultId,
        questionId: +questionIdStr,
        choiceId: +choiceId,
      })
    );

    this.answerService.createAnswer(resultsToSubmit).subscribe({
      next: (res: any) => {
        document.exitFullscreen();
        localStorage.removeItem('resultId');
        this.router.navigate([`/show-result/${res.data.id}`]);
      },
      error: (err) => {
        console.error('Error submitting answer:', err);
      },
    });
  };
}
