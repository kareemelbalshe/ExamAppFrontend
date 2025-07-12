import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomInput } from '../../shared/custom-input/custom-input';
import { Button } from '../../shared/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    CustomInput,
    Button,
  ],
})
export class Login {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  login() {
    if (this.form.valid) {
      console.log('Logging in with:', this.form.value);
      // هنا تضيف الكول لـ API
    }
  }
}
