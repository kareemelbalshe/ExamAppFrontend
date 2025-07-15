import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { Confirm } from "../../shared/confirm/confirm";
import { Toast } from "../../shared/toast/toast";

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [SidebarComponent, RouterOutlet, Confirm, Toast, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css', '../../layout/header/header.css'],
})
export class AdminDashboard {

  darkMode = localStorage.getItem('dark') === 'true';

  @ViewChild('dashboardContainer', { static: false }) dashboardRef!: ElementRef;

  constructor(private renderer: Renderer2) {
    document.body.classList.toggle('dark-mode', this.darkMode);
  }

  ngAfterViewInit() {
    this.updateContainerTheme();
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('dark', this.darkMode.toString());
    document.body.classList.toggle('dark-mode', this.darkMode);
    this.updateContainerTheme();
  }

  private updateContainerTheme() {
    if (!this.dashboardRef) return;

    if (this.darkMode) {
      this.renderer.addClass(this.dashboardRef.nativeElement, 'dashboard-container-dark');
    } else {
      this.renderer.removeClass(this.dashboardRef.nativeElement, 'dashboard-container-dark');
    }
  }
}

