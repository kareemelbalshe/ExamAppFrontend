// import { StudentService } from './../../services/student/student';
import { StudentService } from './../../services/student/student';
import { ResultService } from './../../services/result/result.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Result, ResultWithDetails } from '../../models/result';

@Component({
  selector: 'app-show-result',
  imports: [CommonModule],
  templateUrl: './show-result.html',
  styleUrl: './show-result.css',
})
export class ShowResult implements OnInit {
  resultId: number = 0;
  result?: Result;
  isLoading: boolean = true;

  constructor(
    private resultService: ResultService,
    private studentService: StudentService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.resultId = +params['resultId']!;
      this.isLoading = false;
      this.loadResults();
    });
  }
  loadResults() {
    this.resultService.getResultById(this.resultId).subscribe({
      next: (res: any) => {
        console.log('Result:', res);
        this.result = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching result:', err);
      },
    });
  }
}
