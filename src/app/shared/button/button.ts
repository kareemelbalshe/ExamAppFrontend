import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.css'],
})
export class Button {
  @Input() text: string = 'Button';
  @Input() icon: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() btnStyle: string = 'primary';
  @Input() loading: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  handleClick() {
    if (!this.loading) this.clicked.emit();
  }
}
