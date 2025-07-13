import { Component, inject } from '@angular/core';
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
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

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
  auth = inject(Auth);
  router = inject(Router);
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
      this.auth.login(this.form.value).subscribe({
        next: (res) => {
          this.auth.setLoggedIn(true);
          if (res.data.role === 'Admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          console.error('Login error:', err);
        },
      });
    }
  }
}
