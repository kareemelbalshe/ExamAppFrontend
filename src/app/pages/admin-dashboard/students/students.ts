import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from '../../../shared/table/table';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/dialog/dialog';
import { CustomInput } from '../../../shared/custom-input/custom-input';
import { Button } from '../../../shared/button/button';
import { ConfirmService } from '../../../services/confirm.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { CreateStudent, Student } from '../../../models/user';
import { StudentService } from '../../../services/student/student';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-students',
  standalone: true,
  imports: [CommonModule, Table, CustomInput, Button, ReactiveFormsModule],
  templateUrl: './students.html',
  styleUrls: ['./students.css'],
})
export class AllStudents implements OnInit {
  router = inject(Router);

  columns = [
    { label: 'ID', field: 'id', sortable: true },
    { label: 'Username', field: 'username', sortable: true },
    { label: 'Email', field: 'email', sortable: true },
    { label: 'Role', field: 'role' },
    // { label: 'Deleted', field: 'isDeleted', pipe: 'boolean', sortable: true },
    { label: 'Deleted', field: 'isDeleted', pipe: 'deletedStatus', sortable: true },
  ];

  actions = [
    { icon: 'fas fa-edit', tooltip: 'Edit', type: 'edit', color: '#007bff' },
    { icon: 'fas fa-trash', tooltip: 'Delete', type: 'delete', color: '#dc3545' },
    { icon: 'fas fa-eye', tooltip: 'View', type: 'view', color: '#28a745' },
  ];

  students: Student[] = [];
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
    private studentService: StudentService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    public confirm: ConfirmService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.fetchStudents();

    this.searchTerm.valueChanges.pipe(debounceTime(400)).subscribe(() => {
      this.paginationInfo.currentPage = 1;
      this.fetchStudents();
    });
  }

  fetchStudents(): void {
    this.loading = true;
    const name = this.searchTerm.value || '';
    const sortBy = this.currentSort?.field || 'id';
    const isDesc = this.currentSort?.direction === 'desc';

    this.studentService
      .getAllStudents(name, sortBy, isDesc, this.paginationInfo.currentPage, this.paginationInfo.itemsPerPage)
      .subscribe({
        next: (res) => {
          this.students = res.items;
          this.paginationInfo.totalItems = res.totalItems;
          this.paginationInfo.totalPages = res.totalPages;
          this.paginationInfo.currentPage = res.currentPage;

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Error fetching students:', err);
          this.students = [];
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  openDialog(action: string = 'add', student?: Student): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: action === 'edit' ? 'Edit Student' : 'Add Student',
        action,
        student,
        formType: 'student',
      },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        action === 'edit' ? this.updateStudent(result) : this.addStudent(result);
      }
    });
  }

  onActionClick(event: { type: string; row: any }) {
    switch (event.type) {
      case 'edit':
        this.editStudent(event.row);
        break;
      case 'delete':
        this.deleteStudent(event.row);
        break;
      case 'view':
        this.viewStudent(event.row);
        break;
    }
  }

  onPageChange(page: number): void {
    this.paginationInfo.currentPage = page;
    this.fetchStudents();
  }

  onSortChange(event: { field: string; direction: 'asc' | 'desc' }): void {
    this.currentSort = event;
    this.fetchStudents();
  }

  private addStudent(student: Student) {
    const payload: CreateStudent = {
      username: student.username,
      email: student.email,
      password: student.password || '123456',
    };

    this.studentService.addStudent(payload).subscribe({
      next: () => {
        this.toast.show('Student added successfully', 'success');
        this.fetchStudents();
      },
      error: () => this.toast.show('Failed to add student', 'error'),
    });
  }

  private editStudent(student: Student) {
    this.openDialog('edit', student);
  }

  private updateStudent(student: Student) {
    const payload: CreateStudent = {
      username: student.username,
      email: student.email,
      password: student.password || '',
    };

    this.studentService.updateStudent(student.id!, payload).subscribe({
      next: () => {
        this.toast.show('Student updated successfully', 'success');
        this.fetchStudents();
      },
      error: () => this.toast.show('Failed to update student', 'error'),
    });
  }

  private deleteStudent(student: Student) {
    this.confirm.show(
      'Delete Confirmation',
      `Are you sure you want to delete the student "${student.username}"?`,
      () => {
        this.studentService.deleteStudent(student.id).subscribe({
          next: () => {
            this.toast.show('Student deleted successfully', 'success');
            this.fetchStudents();
          },
          error: (e) => this.toast.show(e.error.message || 'Failed to delete student', 'error'),
        });
      }
      ,
      {
        isSuccess: false,
        okText: 'Delete',
      }
    );
  }

  private viewStudent(student: Student) {
    if (student?.id) {
      this.router.navigate(['/student/result', student.id]);
    }
  }

}
