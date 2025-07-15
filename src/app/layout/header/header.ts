import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  styleUrls: ['./header.css'],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  router = inject(Router);
  authService = inject(Auth);
  isLoggedIn = false;
  darkMode = localStorage.getItem('dark') === 'true';

  constructor() {
    document.body.classList.toggle('dark-mode', this.darkMode);
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('dark', this.darkMode.toString());
    document.body.classList.toggle('dark-mode', this.darkMode);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
