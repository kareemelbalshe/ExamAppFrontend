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
import { Toast } from '../../shared/toast/toast';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    CustomInput,
    Button,
    Toast
  ],
})
export class Login {
  form: FormGroup;
  auth = inject(Auth);
  router = inject(Router);
  toast = inject(ToastService);

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
  isLoading: boolean = false;
  login() {
    if (this.form.valid) {
      this.isLoading = true;
      this.auth.login(this.form.value).subscribe({
        next: (res) => {
          this.auth.setLoggedIn(true);
          const redirectTo = res.data.role === 'Admin' ? '/dashboard' : '/home';
          this.router.navigate([redirectTo]);
          this.toast.show('Logged in successfully!', 'success');
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Login error:', err);
          this.toast.show('Invalid email or password', 'error');
        }
      });
    } else {
      this.isLoading = false;
      this.form.markAllAsTouched();
      this.toast.show('Please fill all required fields.', 'warning');
    }
  }
}
