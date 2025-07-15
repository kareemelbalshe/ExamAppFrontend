import { Component, Input } from '@angular/core';
import { Exam } from '../../../../models/exam';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../../shared/button/button';
import { Router } from '@angular/router';
import { ConfirmService } from '../../../../services/confirm.service';
import { Auth } from '../../../../services/auth';
import { ResultService } from '../../../../services/result/result.service';
import { Result } from '../../../../models/result';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, FormsModule, Button],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  constructor(
    private router: Router,
    private confirmService: ConfirmService,
    private resultService: ResultService,
    private auth: Auth
  ) {}

  @Input() exam!: Exam;
  @Input() buttonText: string = 'Take Exam';
  color: string = '#28a745';

  onClick() {
    this.confirmService.show(
      'Take Exam',
      'Are you sure you want to take this exam?',
      this.onClickConfirmed
    );
  }

  onClickConfirmed = () => {
    const studentId = this.auth.getUserId();
    const examId = this.exam.id;

    const result: Result = {
      studentId: Number(studentId),
      examId: examId,
      attemptNumber: 1,
      score: 1,
      status: 'Started',
      startTime: new Date(),
      // endTime: '2020-08-28T04:21:27.236Z',
      // takenAt: '2020-08-28T04:20:27.236Z',
    };
    this.resultService.createResult(result).subscribe({
      next: (res: any) => {
        this.router.navigate([`/take-exam/${examId}`]);
        localStorage.setItem('resultId', res?.data?.id);
      },
      error: (err) => {
        console.error('Error creating result:', err);
        this.confirmService.show(
          'Error',
          'Could not start the exam. Please try again later.',
          () => {},
          { okText: 'Ok', isPrompt: true, isSuccess: false }
        );
      },
    });
  };
}
