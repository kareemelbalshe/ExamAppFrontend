import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from '../../../shared/table/table';
import { Exam } from '../../../models/exam';
import { ExamService } from '../../../services/exam.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/dialog/dialog';
import { CustomInput } from '../../../shared/custom-input/custom-input';
import { Button } from '../../../shared/button/button';
import { ConfirmService } from '../../../shared/confirm/confirm.service';
import { CreateExam } from '../../../models/dtos/Exam/CreateExam';
import { ToastService } from '../../../shared/toast/toast.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-exams',
  standalone: true,
  imports: [CommonModule, Table, CustomInput, Button, ReactiveFormsModule],
  templateUrl: './all-exams.html',
  styleUrl: './all-exams.css',
})
export class AllExams implements OnInit {
  columns = [
    { label: 'ID', field: 'id', sortable: true },
    { label: 'Exam Title', field: 'title', sortable: true },
    { label: 'Description', field: 'description' },
    { label: 'Start Time', field: 'startTime', pipe: 'date', sortable: true },
    { label: 'End Time', field: 'endTime', pipe: 'date', sortable: true },
    { label: 'Status', field: 'isActive', pipe: 'boolean', sortable: true },
  ];

  actions = [
    { icon: 'fas fa-edit', tooltip: 'Edit', type: 'edit', color: '#007bff' },
    { icon: 'fas fa-trash', tooltip: 'Delete', type: 'delete', color: '#dc3545' },
    { icon: 'fas fa-eye', tooltip: 'View', type: 'view', color: '#28a745' },
  ];

  exams: Exam[] = [];
  loading = false;
  searchTerm = new FormControl(''); 
  paginationInfo = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  };
  currentSort: { field: string; direction: 'asc' | 'desc' } | null = null;

  constructor(
    private examService: ExamService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    public confirm: ConfirmService,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchExams();

    this.searchTerm.valueChanges.pipe(debounceTime(400)).subscribe(() => {
      this.paginationInfo.currentPage = 1;
      this.fetchExams();
    });
  }

  fetchExams(): void {
    this.loading = true;
    const name = this.searchTerm.value || '';
    const sortBy = this.currentSort?.field || 'id';
    const isDesc = this.currentSort?.direction === 'desc';

    this.examService
      .getAllExams(name, sortBy, isDesc, this.paginationInfo.currentPage, this.paginationInfo.itemsPerPage)
      .subscribe({
        next: (res) => {

          this.exams = res.items;
          this.paginationInfo.totalItems = res.totalItems;
          this.paginationInfo.totalPages = res.totalPages;
          this.paginationInfo.currentPage = res.currentPage;

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

  openDialog(action: string = 'add', exam?: Exam): void {
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
        action === 'edit' ? this.updateExam(result) : this.addExam(result);
      }
    });
  }

  onActionClick(event: { type: string; row: any }) {
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

  onPageChange(page: number): void {
    this.paginationInfo.currentPage = page;
    this.fetchExams();
  }

  onSortChange(event: { field: string; direction: 'asc' | 'desc' }): void {
    this.currentSort = event;
    this.fetchExams();
  }

  private addExam(exam: Exam) {
    const payload: CreateExam = {
      title: exam.title,
      description: exam.description,
      startTime: exam.startTime,
      endTime: exam.endTime,
      createdBy: 1,
    };

    this.examService.addExam(payload).subscribe({
      next: () => {
        this.toast.show('Exam added successfully', 'success');
        this.fetchExams();
      },
      error: () => this.toast.show('Failed to add exam', 'error'),
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
      createdBy: 1,
    };

    this.examService.updateExam(exam.id!, payload).subscribe({
      next: () => {
        this.toast.show('Exam updated successfully', 'success');
        this.fetchExams();
      },
      error: () => this.toast.show('Failed to update exam', 'error'),
    });
  }

  private deleteExam(exam: Exam) {
    this.confirm.show(
      'Delete Confirmation',
      `Are you sure you want to delete the exam "${exam.title}"?`,
      () => {
        this.examService.deleteExam(exam.id).subscribe({
          next: () => {
            this.toast.show('Exam deleted successfully', 'success');
            this.fetchExams();
          },
          error: () => this.toast.show('Failed to delete exam', 'error'),
        });
      }
    );
  }

  private viewExam(exam: Exam) {
    if (exam?.id) 
      this.router.navigateByUrl(`/dashboard/exams/${exam.id}`);
  }

  
}