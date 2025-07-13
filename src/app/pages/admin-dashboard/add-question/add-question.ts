import { Choice } from './../../../models/choice';
import { Question } from './../../../models/question';
import { ChoiceDto } from './../../../models/dtos/choice/create-choice-dto';
import { CreateQuestionDto } from './../../../models/dtos/question/create-question-dto';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '../../../shared/button/button';
import { QuestionService } from '../../../services/question/question-service';
import { ChoiceService } from '../../../services/choice/choice-service';
import { QuestionDto } from '../../../models/dtos/question/choice-dto';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.html',
  styleUrl: './add-question.css',
  imports: [CommonModule, FormsModule, Button],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(20px)' })
        ),
      ]),
    ]),
  ],
})
export class AddQuestion {
  @Input() isEditMode = false;
  @Input() questionId?: number | string | null;
  @Input() examId?: number;

  // Question text
  questionText = '';

  // All current choices displayed in UI
  choices: Choice[] = [];

  // Only for edit mode
  originalChoices: Choice[] = [];
  updatedChoices: Choice[] = [];
  deletedChoiceIds: number[] = [];
  originalQuestionText = '';

  // Mock API service - replace with real service
  private api = {
    createQuestion: (q: any) => console.log('POST create', q),
    updateQuestion: (id: any, text: string) =>
      console.log('PUT question', id, text),
    updateChoicesRange: (choices: Choice[]) =>
      console.log('PUT choices', choices),
    deleteChoices: (ids: number[]) => console.log('DELETE choices', ids),
  };

  constructor(
    private questionService: QuestionService,
    private choiceService: ChoiceService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('AddQuestion component initialized');
    this.route.data.subscribe((data) => {
      this.isEditMode = data['isEditMode'] === true;
      if (this.isEditMode)
        this.route.paramMap.subscribe((params) => {
          this.questionId = +params.get('id')!;
          this.loadQuestionForEdit(
            this.questionId ? Number(this.questionId) : 0
          );
        });
      else {
        this.route.paramMap.subscribe((params) => {
          this.examId = +params.get('examId')!;
          console.log('Exam ID:', this.examId);
          // Initialize with empty question text and choices
          this.questionText = '';
          this.choices = [{ text: '', isCorrect: false }]; // Start with one empty choice
        });
      }
      console.log('Edit mode:', this.isEditMode);
    });
  }

  async loadQuestionForEdit(questionId: number) {
    // Example: load from backend
    this.questionService.getQuestion(questionId).subscribe({
      next: (response) => {
        this.questionText = response.data.text;
        this.originalQuestionText = response.data.text;
        console.log('Question loaded:', this.questionText);
        if (response.data.id) this.loadChoicesForEdit(response.data.id);
        this.cdr.detectChanges(); // Ensure view updates with new data
      },
      error: (err) => {
        console.error('Error loading question:', err);
        this.router.navigate(['/not-found']); // Redirect to NotFound page if question not found
      },
    });
  }
  loadChoicesForEdit(questionId?: number) {
    // Example: load from backend
    this.choiceService.getQuestionChoices(Number(questionId)).subscribe({
      next: (response) => {
        this.choices = response.data.$values || [];
        this.originalChoices = [...this.choices];
        this.cdr.detectChanges(); // Ensure view updates with new data
      },
      error: (err) => {
        console.error('Error loading choices:', err);
      },
    });
  }

  addChoice() {
    let isEmptyCell =
      this.choices[this.choices.length - 1]?.text?.trim() ?? '' != ''
        ? false
        : true;
    if (isEmptyCell && this.choices.length > 0) {
      alert('Please fill the last choice before adding a new one.');
      return;
    }
    this.choices.push({ text: '', isCorrect: false });
  }

  removeChoice(choice: Choice) {
    if (choice.id) {
      this.deletedChoiceIds.push(choice.id);
    }
    this.choices = this.choices.filter((c) => c != choice);
  }

  markChoiceAsUpdated(choice: Choice) {
    if (choice.id && !this.updatedChoices.includes(choice)) {
      this.updatedChoices.push(choice);
    }
  }
  markChoiceAsUnchanged(choice: Choice) {
    if (choice.id && !this.updatedChoices.includes(choice)) {
      this.updatedChoices.push(choice);
    }
  }

  async onSubmit() {
    if (!this.isEditMode) {
      // CREATE MODE
    } else {
      // EDIT MODE
      if (this.questionId) {
        await this.api.updateQuestion(this.questionId, this.questionText);
      }

      if (this.updatedChoices.length) {
        await this.api.updateChoicesRange(this.updatedChoices);
      }

      if (this.deletedChoiceIds.length) {
        await this.api.deleteChoices(this.deletedChoiceIds);
      }

      alert('Changes Saved!');
    }
  }

  async onCreate() {
    if (!this.examId) {
      alert('Exam ID is required to create a question.');
      return;
    }
    let createQuestionDto: CreateQuestionDto = {
      text: this.questionText,
      choices: this.choices.map(
        (choice): ChoiceDto => ({
          text: choice.text,
          isCorrect: choice.isCorrect ?? false,
          questionId: this.questionId ? Number(this.questionId) : 0, // Use the questionId if available, otherwise default to 0
          // Default to false if not specified
        })
      ),
      examId: this.examId,
    };
    console.log('Creating question with payload:', createQuestionDto);

    this.questionService.createQuestion(createQuestionDto).subscribe({
      next: (response) => {
        console.log('Question created successfully:', response);
        // this.router.navigate(['/admin-dashboard/questions']);
        alert('Question Created!');
      },
      error: async (err) => {
        console.error('Error creating question:', await err.message);
        alert('Failed to create question. Please try again.');
      },
    });
    alert('Question Created!');
  }

  async onUpdate() {
    if (!this.questionId) {
      alert('Question ID is required to update a question.');
      return;
    }
    if (this.choices.length == 0) {
      alert('Question text cannot be empty.');
      return;
    }
    if (this.questionText.trim() == '') {
      alert('Question text cannot be empty.');
      return;
    }

    let questionDto: QuestionDto = {
      text: this.questionText,
      id: this.questionId ? Number(this.questionId) : 0, // Use the questionId if available, otherwise default to 0
      choices: this.choices.map(
        (c): Choice => ({
          id: c.id ? Number(c.id) : 0, // Use the choice ID if available, otherwise default to 0
          isCorrect: c.isCorrect ?? false, // Default to false if not specified
          questionId: this.questionId ? Number(this.questionId) : 0, // Use the questionId if available, otherwise default to 0
          text: c.text,
        })
      ), // Default to false if not specified
    };

    this.questionService
      .updateQuestion(Number(this.questionId), questionDto)
      .subscribe({
        next: (response) => {
          console.log('Question updated successfully:', response);
        },
        error: (err) => {
          console.error('Error updating question:', err);
          alert('Failed to update question. Please try again.');
        },
      });

    //   if (this.questionId && this.questionText != this.originalQuestionText) {
    //   await this.questionService.updateQuestion(Number(this.questionId),{id:Number(this.questionId), text: this.questionText} ).subscribe({
    //     next: (response) => {
    //       console.log('Question updated successfully:', response);
    //     },
    //     error: (err) => {
    //       console.error('Error updating question:', err);
    //       alert('Failed to update question. Please try again.');
    //     }
    //   });
    //   console.log('Updating question with ID:', this.questionId);
    // }

    // if (this.updatedChoices.length) {
    //   await this.choiceService.updateRange(this.updatedChoices).subscribe(
    //     response => {
    //       console.log('Choices updated successfully:', response);
    //     },
    //     error => {
    //       console.error('Error updating choices:', error);
    //       alert('Failed to update choices. Please try again.');
    //     }
    //   );
    // }

    // if (this.deletedChoiceIds.length > 0) {
    //   for (let choice of this.deletedChoiceIds)
    //     await this.choiceService.deleteChoice(choice).subscribe(
    //       response => {
    //         console.log('Choice deleted successfully:', response);
    //       },
    //       error => {
    //         console.error('Error deleting choice:', error)
    //       });
    //   console.log('Deleted choices with IDs:', this.deletedChoiceIds);
    // }

    alert('Changes Saved!');
  }

  toggleCorrect(choice: Choice) {
    choice.isCorrect = !choice.isCorrect;
    this.markChoiceAsUpdated(choice);
  }
  getChoiceLabel(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C...
  }
}
