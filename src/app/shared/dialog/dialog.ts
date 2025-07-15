import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Exam } from '../../models/exam';
import { Student } from '../../models/user';

import { Button } from "../button/button";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    Button,
  ],
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.css'],
})
export class DialogComponent implements OnInit {
  examForm: FormGroup;
  studentForm: FormGroup;
  loading = false;
  dateTimeError: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      action: string;
      formType: 'exam' | 'student';
      exam?: Exam;
      student?: Student;
    },
    private fb: FormBuilder
  ) {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      isActive: [false],
    });

    this.studentForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
    });
  }

  ngOnInit(): void {
    if (
      this.data.formType === 'exam' &&
      this.data.action === 'edit' &&
      this.data.exam
    ) {
      this.populateExamForm(this.data.exam);
    }

    if (
      this.data.formType === 'student' &&
      this.data.action === 'edit' &&
      this.data.student
    ) {
      this.populateStudentForm(this.data.student);
    }

    if (this.data.formType === 'student' && this.data.action === 'add') {
      this.studentForm.get('password')?.setValidators([Validators.required]);
      this.studentForm.get('password')?.updateValueAndValidity();
    }
  }

  populateExamForm(exam: Exam): void {
    const startDateTime = new Date(exam.startTime);
    const endDateTime = new Date(exam.endTime);

    this.examForm.patchValue({
      title: exam.title,
      description: exam.description,
      startDate: startDateTime,
      startTime: this.formatTime(startDateTime),
      endDate: endDateTime,
      endTime: this.formatTime(endDateTime),
      isActive: exam.isActive,
    });
  }

  populateStudentForm(student: Student): void {
    this.studentForm.patchValue({
      username: student.username,
      email: student.email,
    });
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  formatToLocalISO(date: Date): string {
    const offset = date.getTimezoneOffset() * 60000;
    const localTime = new Date(date.getTime() - offset);
    return localTime.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"
  }

  combineDateTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
      0
    );
  }

  onSubmit(): void {
    this.dateTimeError = '';

    if (this.data.formType === 'exam') {
      this.examForm.markAllAsTouched();

      if (this.examForm.invalid) {
        return;
      }

      this.loading = true;

      const formValue = this.examForm.value;
      const startDateTime = this.combineDateTime(
        formValue.startDate,
        formValue.startTime
      );
      const endDateTime = this.combineDateTime(
        formValue.endDate,
        formValue.endTime
      );

      if (endDateTime <= startDateTime) {
        this.dateTimeError =
          'End date and time must be after start date and time';
        this.loading = false;
        return;
      }

      const now = new Date();
      if (startDateTime < now) {
        this.dateTimeError = 'Start date and time cannot be in the past';
        this.loading = false;
        return;
      }

      const examData: Exam = {
        ...formValue,
        id: this.data?.exam?.id,
        startTime: this.formatToLocalISO(startDateTime),
        endTime: this.formatToLocalISO(endDateTime),
      };

      console.log('✅ Exam Data to Submit:', examData);
      this.dialogRef.close(examData);
    }

    if (this.data.formType === 'student') {
      this.studentForm.markAllAsTouched();

      if (this.studentForm.invalid) {
        return;
      }

      this.loading = true;

      const studentData: Student = {
        ...this.data.student,
        ...this.studentForm.value,
      };

      this.dialogRef.close(studentData);
    }

    this.loading = false;
  }

  close(): void {
    this.dialogRef.close();
  }
}
