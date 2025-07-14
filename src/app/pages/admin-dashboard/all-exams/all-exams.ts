import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from '../../../shared/table/table';
import { Exam } from '../../../models/exam';
import { ExamService } from '../../../services/exam.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/dialog/dialog';
import { CustomInput } from "../../../shared/custom-input/custom-input";
import { Button } from "../../../shared/button/button";
import { ConfirmService } from '../../../shared/confirm/confirm.service';
import { CreateExam } from '../../../models/dtos/Exam/CreateExam';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-all-exams',
  standalone: true,
  imports: [CommonModule, Table, CustomInput, Button],
  templateUrl: './all-exams.html',
  styleUrl: './all-exams.css',
})
export class AllExams implements OnInit {
  columns = [
    { label: 'ID', field: 'id' },
    { label: 'Exam Title', field: 'title' },
    { label: 'Description', field: 'description' },
    { label: 'Start Time', field: 'startTime', pipe: 'date' },
    { label: 'End Time', field: 'endTime', pipe: 'date' },
    { label: 'Status', field: 'isActive', pipe: 'boolean' },
  ];

  actions = [
    { icon: 'fas fa-edit', tooltip: 'Edit', type: 'edit', color: '#007bff' },
    { icon: 'fas fa-trash', tooltip: 'Delete', type: 'delete', color: '#dc3545' },
    { icon: 'fas fa-eye', tooltip: 'View', type: 'view', color: '#28a745' },
  ];

  exams: Exam[] = [];
  loading = false;
  searchTerm: any = '';
  constructor(
    private examService: ExamService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    public confirm: ConfirmService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.fetchExams();
  }

  fetchExams() {
    this.loading = true;
    this.examService.getAllExams().subscribe({
      next: (data) => {
        this.exams = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error fetching exams:', err);
        this.exams = [];
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openDialog(action: string = 'add', exam?: Exam) {

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: action === 'edit' ? 'Edit Exam' : 'Add Exam',
        action,
        exam,
      },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'edit') {
          this.updateExam(result);
        } else {
          this.addExam(result);
        }
      }
    });
  }

  onActionClick(event: { type: string; row: any }) {
    console.log('Action clicked:', event.type, event.row);
    switch (event.type) {
      case 'edit':
        this.editExam(event.row);
        break;
      case 'delete':
        this.deleteExam(event.row);
        break;
      case 'view':
        this.viewExam(event.row);
        break;
    }
  }

  private addExam(exam: Exam) {
    const payload: CreateExam = {
      title: exam.title,
      description: exam.description,
      startTime: exam.startTime,
      endTime: exam.endTime,
      createdBy: 1
    };

    this.examService.addExam(payload).subscribe({
      next: (newExam) => {
        this.exams = [...this.exams, newExam];
        this.toast.show('Exam added successfully', 'success');
        this.fetchExams();
        this.cdr.detectChanges();
      },
      error: (err) => this.toast.show(' Failed to add exam', 'error'),
    });
  }

  private editExam(exam: Exam) {
    this.openDialog('edit', exam);
  }

  private updateExam(exam: Exam) {
    const payload: CreateExam = {
      title: exam.title,
      description: exam.description,
      startTime: exam.startTime,
      endTime: exam.endTime,
      createdBy: 1
    };

    this.examService.updateExam(exam.id!, payload).subscribe({
      next: (updatedExam) => {
        this.exams = this.exams.map((e) =>
          e.id === updatedExam.id ? updatedExam : e
        );
        this.toast.show('Exam updated successfully', 'success');
        this.fetchExams();
        this.cdr.detectChanges();
      },
      error: (err) => this.toast.show('Failed to update exam', 'error'),
    });
  }

  private deleteExam(exam: Exam) {
    this.confirm.show(
      'Delete Confirmation',
      `Are you sure you want to delete the exam "${exam.title}"?`,
      () => {
        this.examService.deleteExam(exam.id).subscribe({
          next: () => {
            this.exams = this.exams.filter((e) => e.id !== exam.id);
            this.toast.show('Exam deleted successfully', 'success');
            this.fetchExams();
            this.cdr.detectChanges();
          },
          error: (err) => this.toast.show('Failed to delete exam', 'error'),
        });
      }
    );
  }


  private viewExam(exam: Exam) {
    console.log('View exam:', exam);
    // Implement view logic if needed
  }
}
