import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
  standalone: true,
})
export class Button {
  @Input() text: string = 'Button';
  @Input() icon: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() btnStyle: string = 'primary';
  @Output() clicked = new EventEmitter<void>();

  handleClick() {
    this.clicked.emit();
  }
}
