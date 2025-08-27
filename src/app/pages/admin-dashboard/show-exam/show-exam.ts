import { ConfirmService } from '../../../services/confirm.service';

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Question } from '../../../models/question';
import { QuestionService } from '../../../services/question/question-service';
import { CommonModule } from '@angular/common';
import { QuestionDto } from '../../../models/dtos/question/question-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { Choice } from '../../../models/choice';
import { animate, style, transition, trigger } from '@angular/animations';
import { Confirm } from '../../../shared/confirm/confirm';
import { ExamService } from '../../../services/exam.service';
import { Exam } from '../../../models/exam';

@Component({
  selector: 'app-show-exam',
  imports: [CommonModule],
  templateUrl: './show-exam.html',
  styleUrl: './show-exam.css',
  animations: [
    trigger('slideToggle', [
      transition(':enter', [
        style({ height: '0px', opacity: 0 }),
        animate('250ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('250ms ease-in', style({ height: '0px', opacity: 0 })),
      ]),
    ]),
  ],
})
export class ShowExam implements OnInit {
  examId = 1;
  questions: QuestionDto[] = [];
  isLoading = false;
  error = '';
  expandedQuestionIds = new Set<number>();
  exam?: Exam;

  constructor(
    private questionsService: QuestionService,
    private examService: ExamService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.examId = +params['id'];
      this.loadExam();
      this.loadQuestions();
    });
  }
  loadExam() {
    this.isLoading = true;
    this.examService.getExamById(this.examId).subscribe({
      next: (exam) => {
        console.log('Exam loaded:', exam);
        this.exam = exam;
        this.isLoading = false;
        this.cdr.detectChanges(); // Ensure view updates after async operation
      },
      error: (err) => {
        console.error('Failed to load exam', err);
        this.error = 'Failed to load exam';
        this.isLoading = false;
        this.cdr.detectChanges(); // Ensure view updates after error
      },
    });
  }
  loadQuestions() {
    this.isLoading = true;
    let x = this.questionsService
      .getQuestionsByExamIdWithChoices(this.examId)
      .subscribe({
        next: (response) => {
          console.log('Questions loaded:', response.data);
          let responseQuestions = response?.data || [];
          if (!Array.isArray(responseQuestions)) {
            this.questions = [];
          } else {
            let extractedQuestions = responseQuestions.map((q: any) => {
              console.log('Choices for question:', q?.choices);

              q.choices = q?.choices || [];
              return q;
            });
            this.questions = extractedQuestions;
            console.log('Extracted questions:', this.questions);
          }
          this.isLoading = false;
          this.cdr.detectChanges(); // Ensure view updates after async operation
        },
        error: (err) => {
          console.error('Failed to load questions', err);
          this.error = 'Failed to load questions';
          this.isLoading = false;
          this.cdr.detectChanges(); // Ensure view updates after error
        },
      });
  }

  toggleExpand(questionId: number) {
    if (this.expandedQuestionIds.has(questionId)) {
      this.expandedQuestionIds.delete(questionId);
    } else {
      this.expandedQuestionIds.add(questionId);
    }
  }

  isExpanded(questionId: number): boolean {
    return this.expandedQuestionIds.has(questionId);
  }

  onDelete(questionId: number) {
    this.confirmService.show(
      'Delete Question',
      'Are you sure you want to delete this question?',
      () => this.onDeleteConfirm(questionId),
      {
        okText: 'Delete',
        isSuccess: false,
      }
    );
  }
  onDeleteConfirm = (questionId: number) => {
    this.questionsService.deleteQuestion(questionId).subscribe({
      next: () => this.loadQuestions(),
      error: (error) => {
        this.confirmService.show(
          'Error',
          `Failed to delete question. Please try again.`,
          () => {},
          {
            okText: 'Ok',
            isSuccess: false,
            isPrompt: true,
          }
        );
      },
    });
  };

  onEdit(question: QuestionDto) {
    this.router.navigateByUrl(`/dashboard/question/edit/${question.id}`);
  }

  onAdd() {
    this.router.navigateByUrl(`/dashboard/question/add/${this.examId}`);
  }
}
