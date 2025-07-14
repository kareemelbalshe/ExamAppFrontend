import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from './confirm.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm.html',
  styleUrls: ['./confirm.css']
})
export class Confirm {
  constructor(public confirm: ConfirmService) {}

  isDarkMode() {
    return document.body.classList.contains('dark-mode');
  }
}
