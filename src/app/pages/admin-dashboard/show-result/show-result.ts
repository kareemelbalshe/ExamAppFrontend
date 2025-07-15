import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';
import { Location } from '@angular/common';
import { ResultWithDetails } from '../../../models/result';
import { Student } from '../../../models/user';
import { ResultService } from '../../../services/result/result.service';
import { StudentService } from '../../../services/student/student';

@Component({
  selector: 'app-show-result',
  imports: [CommonModule,],
  templateUrl: './show-result.html',
  styleUrl: './show-result.css',
  animations: [
    trigger('fadeInStagger', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger('100ms', [
              animate(
                '600ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class ShowResults {

  results: ResultWithDetails[] = [];
  student?: Student;
  studentId?: number;
  isLoading: boolean = true;

  constructor(
    private resultService: ResultService,
    private studentService: StudentService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      this.studentId = +params['studentId']!;

      if (!this.studentId) return this.router.navigate(['/not-found']);
      this.loadStudent()?.subscribe({
        next: (student) => {
          this.isLoading = false;
          this.loadResults();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error fetching the results:', err);
        },
      });
      return;
    });
  }

  loadStudent() {
    if (!this.studentId) {
      console.error('Student ID is not set.');
      return;
    }
    let observer = this.studentService.getStudentById(this.studentId);
    observer.subscribe({
      next: (student) => {
        console.log('Student:', student);
        this.student = student;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.router.navigate(['/not-found']);
        console.error('Error fetching student:', err);
      },
    });
    return observer;
  }

  loadResults(): void {
    if (!this.studentId) {
      console.error('Student ID is not set.');
      return;
    }
    this.resultService.getResultByStudentId(this.studentId).subscribe({
      next: (result) => {
        console.log('Result:', result);
        this.results = result.data.$values || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching result:', err);
      },
    });
  }
}
