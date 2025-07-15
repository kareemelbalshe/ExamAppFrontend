import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ResultWithDetails } from '../../models/result';
import { Student } from '../../models/user';
import { ResultService } from '../../services/result/result.service';
import { StudentService } from '../../services/student/student';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
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
export class Profile implements OnInit{
  results: ResultWithDetails[] = [];
  student?: Student;
  studentId?: number;
  isLoading: boolean = true;

  constructor(
    private resultService: ResultService,
    private studentService: StudentService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  goBack() {
    this.location.back();
  }

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
        this.cdr.detectChanges(); // Ensure the view is updated with the student data
        // You can use the student data as needed
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
        this.cdr.detectChanges(); // Ensure the view is updated with the results data
      },
      error: (err) => {
        console.error('Error fetching result:', err);
      },
    });
  }
}
