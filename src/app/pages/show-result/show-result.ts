import { ResultService } from './../../services/result/result.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-result',
  imports: [],
  templateUrl: './show-result.html',
  styleUrl: './show-result.css'
})
export class ShowResult implements OnInit {
  constructor(private resultService:ResultService) {}

  ngOnInit() {
    const studentId = 1; // Example student ID, replace with actual logic to get the ID
    this.resultService.getResultByStudentId(studentId).subscribe({
      next: (result) => {
        console.log('Result:', result);
      },
      error: (err) => {
        console.error('Error fetching result:', err);
      }
    });
  }

}
