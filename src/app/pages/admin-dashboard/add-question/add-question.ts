
import { Choice } from './../../../models/choice';
import { ChoiceDto } from './../../../models/dtos/choice/create-choice-dto';
import { CreateQuestionDto } from './../../../models/dtos/question/create-question-dto';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '../../../shared/button/button';
import { QuestionService } from '../../../services/question/question-service';
import { ChoiceService } from '../../../services/choice/choice-service';
import { QuestionDto } from '../../../models/dtos/question/choice-dto';
import { CustomInput } from "../../../shared/custom-input/custom-input";
import { Confirm } from "../../../shared/Confirm/confirm";
import { ConfirmService } from '../../../shared/confirm/confirm.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.html',
  styleUrl: './add-question.css',
  imports: [CommonModule, FormsModule, Button, CustomInput, Confirm],
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

  questionTextControl = new FormControl('',[Validators.required]);

  // Question text
  questionText = '';

  // All current choices displayed in UI
  choices: Choice[] = [];

  // Only for edit mode
  originalChoices: Choice[] = [];
  updatedChoices: Choice[] = [];
  deletedChoiceIds: number[] = [];
  originalQuestionText = '';



  constructor(
    private questionService: QuestionService,
    private choiceService: ChoiceService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    console.log('AddQuestion component being initialized');

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
          this.questionText = '';
          this.choices = [{ text: '', isCorrect: false }]; 
        });
      }
      console.log('Edit mode:', this.isEditMode);
    });
  }

  async loadQuestionForEdit(questionId: number) {

    this.questionService.getQuestion(questionId).subscribe({
      next: (response) => {
        this.questionText = response.data.text;
        this.originalQuestionText = response.data.text;
        console.log('Question loaded:', this.questionText);
        if (response.data.id) this.loadChoicesForEdit(response.data.id);

        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error loading question:', err);
        this.router.navigate(['/not-found']); 
      },
    });
  }
  loadChoicesForEdit(questionId?: number) {
    this.choiceService.getQuestionChoices(Number(questionId)).subscribe({
      next: (response) => {
        this.choices = response.data.$values || [];
        this.originalChoices = [...this.choices];
        this.cdr.detectChanges(); 
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

  onCreate() {
    console.log(this.questionText,this.questionTextControl)

    if (!this.examId) {
      this.confirmService.show('','Exam ID is required to create a question.',()=>{this.router.navigateByUrl('/admin-dashboard/exams');});
      return;
    }
    let status = this.isValidData();
    if (!status.isValid) {
      this.confirmService.show('Invalid inputs',status.message,()=>{});
      return;
    }

    
    this.confirmService.show('Confirm Creation', 'Are you sure you want to create this question?',this.onCreateConfirmed )
  }

  onCreateConfirmed = () =>{
    console.log('Creating question with text:', this.questionTextControl);
    let createQuestionDto: CreateQuestionDto = {
      text: this.questionTextControl.value ?? '',

      choices: this.choices.map(
        (choice): ChoiceDto => ({
          text: choice.text,
          isCorrect: choice.isCorrect ?? false,
          questionId: this.questionId ? Number(this.questionId) : 0, 

        })
      ),
      examId: this.examId,
    };
    console.log('Creating question with payload:', createQuestionDto);

    this.questionService.createQuestion(createQuestionDto).subscribe({
      next: (response) => {
        console.log('Question created successfully:', response);
        this.confirmService.show('Success','Question updated successfully!',()=>{
          this.router.navigate(['/admin-dashboard/questions']); 
        }
        );
      },
      error: async (err) => {
        console.error('Error creating question:', await err.message);
        alert('Failed to create question. Please try again.');
      },
    });
  }

  onUpdate() {
    console.log(this.questionText,this.questionTextControl)
    let status = this.isValidData();
    if (!status.isValid) {
      this.confirmService.show('Invalid inputs',status.message,()=>{});
      return;
    }
    this.confirmService.show('Confirm Update', 'Are you sure you want to update this question?', () => {
      this.onUpdateConfirmed();
    });
      
  }

  onUpdateConfirmed =()=> {
    let questionDto: QuestionDto = {
      text: this.questionTextControl.value ?? '',
      id: this.questionId ? Number(this.questionId) : 0, 
      choices: this.choices.map(
        (c): Choice => ({
          id: c.id ? Number(c.id) : 0, 
          isCorrect: c.isCorrect ?? false,
          questionId: this.questionId ? Number(this.questionId) : 0,
          text: c.text,
        })
      ), 

    };

    this.questionService
      .updateQuestion(Number(this.questionId), questionDto)
      .subscribe({
        next: (response) => {
          console.log('Question updated successfully:', response);
          this.confirmService.show('Success','Question updated successfully!',()=>{
            this.router.navigate(['/admin-dashboard/questions']);
          });

        },
        error: (err) => {
          console.error('Error updating question:', err);
          alert('Failed to update question. Please try again.');
        },
      });
  }
  
  toggleCorrect(choice: Choice) {
    choice.isCorrect = !choice.isCorrect;
    this.markChoiceAsUpdated(choice);
  }
  getChoiceLabel(index: number): string {

    return String.fromCharCode(65 + index); 
  }
  
  isValidData(): {isValid:boolean, message:string} {
    if(!this.questionTextControl.valid) 
      return {isValid:false, message:'Question text is required.'};
    if (! (this.choices.length > 1)) 
      return {isValid:false, message:'At least two choices are required.'};
    
    let hasEmptyChoice = !this.choices.every(
          (choice) => choice.text.trim() !== ''
        ) 
    if(hasEmptyChoice)
        return {isValid:false, message:"Choice can't be empty."};
    let hasCorrectChoice = this.choices.some((choice) => choice.isCorrect);
    if (!hasCorrectChoice)  
      return {isValid:false, message:'At least one choice must be marked as correct.'};

    return {isValid:true, message:'Valid data'};


  }
}
