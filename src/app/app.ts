import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { Confirm } from "./shared/confirm/confirm";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    Confirm
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected title = 'Exam System';
  darkMode: boolean = false;

  ngOnInit() {
    this.darkMode = localStorage.getItem('dark') === 'true';

    window.addEventListener('themeChanged', this.handleThemeChange);
  }

  ngOnDestroy() {
    window.removeEventListener('themeChanged', this.handleThemeChange);
  }

  handleThemeChange = (event: Event) => {
    const customEvent = event as CustomEvent;
    this.darkMode = customEvent.detail.dark;
  };
  // darkMode = localStorage.getItem('dark') === 'true';
  constructor(private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        document.body.classList.toggle('dark-mode', this.darkMode);
      }
    });
  }
}
