import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit, OnDestroy {
  currentYear: number = new Date().getFullYear();
  darkMode: boolean = false;

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
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
}
