import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Exam } from '../../models/exam';

import { MatDatepickerInput } from '@angular/material/datepicker';
import { Button } from "../button/button";

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
    Button
  ],
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.css'],
})
export class DialogComponent implements OnInit {
  examForm: FormGroup;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; action: string; exam?: Exam },
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
  }

  ngOnInit(): void {
    if (this.data?.action === 'edit' && this.data.exam) {
      this.populateForm(this.data.exam);
    }

  }

  populateForm(exam: Exam): void {
    const startDateTime = new Date(exam.startTime);
    const endDateTime = new Date(exam.endTime);

    this.examForm.patchValue({
      title: exam.title,
      description: exam.description,
      startDate: startDateTime,
      startTime: this.formatTime(startDateTime),
      endDate: endDateTime,
      endTime: this.formatTime(endDateTime),
      isActive: exam.isActive
    });
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onSubmit(): void {
    if (this.examForm.valid) {
      this.loading = true;
      const formValue = this.examForm.value;

      const startDateTime = this.combineDateTime(formValue.startDate, formValue.startTime);
      const endDateTime = this.combineDateTime(formValue.endDate, formValue.endTime);

      if (endDateTime <= startDateTime) {
        console.error('End time must be after start time');
         this.loading = false;
        return;
      }

      const examData: Exam = {
        ...formValue,
        id: this.data?.exam?.id,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      };

      this.dialogRef.close(examData);
    }
  }


  combineDateTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined;
  }

  close(): void {
    this.dialogRef.close();
  }
}
