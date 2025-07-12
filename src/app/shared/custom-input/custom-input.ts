import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.css',
  imports: [CommonModule, ReactiveFormsModule],
})
export class CustomInput {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control!: FormControl;
  @Input() icon: string = '';
  @Input() type: string = 'text';
  @Input() showToggle: boolean = false;

  show: boolean = false;

  get inputType() {
    return this.showToggle ? (this.show ? 'text' : 'password') : this.type;
  }

  toggleShow() {
    this.show = !this.show;
  }
}
