import { Component, Input } from '@angular/core';
import { Exam } from '../../../../models/exam';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from "../../../../shared/button/button";
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [CommonModule, FormsModule, Button],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  constructor(private router: Router) {}
  @Input() exam!: Exam;
  @Input() buttonText: string = 'Take Exam';
  color: string = '#28a745';

  onClick() {
    this.router.navigate([`/take-exam/${this.exam.id}`]);
  }
}
