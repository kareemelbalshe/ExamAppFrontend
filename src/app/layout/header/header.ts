import { Component } from '@angular/core';
// import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    // TranslateModule,
    RouterModule,
    CommonModule,
  ],
  styleUrls: ['./header.css'],
  templateUrl: './header.html',
})
export class Header {
  isLoggedIn = false;
  darkMode = localStorage.getItem('dark') === 'true';
  // lang = localStorage.getItem('lang') || 'en';

  // constructor(private translate: TranslateService) {
  //   this.translate.use(this.lang);
  //   document.body.classList.toggle('dark-mode', this.darkMode);
  // }
  constructor() {
    document.body.classList.toggle('dark-mode', this.darkMode);
  }

  // toggleLang() {
  //   this.lang = this.lang === 'en' ? 'ar' : 'en';
  //   localStorage.setItem('lang', this.lang);
  //   this.translate.use(this.lang);
  // }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('dark', this.darkMode.toString());
    document.body.classList.toggle('dark-mode', this.darkMode);
  }

  logout() {
    this.isLoggedIn = false;
    // منطق تسجيل الخروج
  }
}
