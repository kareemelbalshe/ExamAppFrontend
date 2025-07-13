import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from '../../../shared/table/table';
import { Exam } from '../../../models/exam';
import { ExamService } from '../../../services/exam.service';

@Component({
  selector: 'app-all-exams',
  standalone: true,
  imports: [CommonModule, Table],
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
    { label: 'Status', field: 'isActive', pipe: 'boolean' }
  ];

  actions = [
    { icon: 'fas fa-edit', tooltip: 'Edit', type: 'edit', color: '#007bff' },
    { icon: 'fas fa-trash', tooltip: 'Delete', type: 'delete', color: '#dc3545' },
    { icon: 'fas fa-eye', tooltip: 'View', type: 'view', color: '#28a745' }
  ];

  exams: Exam[] = [];
  loading = false;

  constructor(
    private examService: ExamService,
    private cdr: ChangeDetectorRef
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
      }
    });
  }

  // Handle action clicks
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

  private editExam(exam: Exam) {
    console.log('Edit exam:', exam);
  }

  private deleteExam(exam: Exam) {
    console.log('Delete exam:', exam);
  }

  private viewExam(exam: Exam) {
    console.log('View exam:', exam);
  }
}