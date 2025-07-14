import { Component } from '@angular/core';
import { Button } from '../../shared/button/button';
import { CustomInput } from '../../shared/custom-input/custom-input';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [Button, CustomInput, FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
  get username(): FormControl {
    return this.form.get('username') as FormControl;
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }
  isLoading: boolean = false;

  register() {
    if (
      this.form.valid &&
      this.form.value.password === this.form.value.confirmPassword
    ) {
      const url = environment.baseUrl + '/User/register';
      this.http.post(url, this.form.value).subscribe({
        next: (res) => {
          console.log('Registered successfully:', res);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Register error:', err);
        },
      });
    } else {
      console.log('Invalid form');
    }
  }
}
