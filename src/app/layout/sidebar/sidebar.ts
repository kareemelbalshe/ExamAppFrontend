import { SidebarItem } from './sidebar.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent {
  router = inject(Router);
  authService = inject(Auth);
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard/statistics' },
    { label: 'Exams', icon: 'assignment', route: '/dashboard/exams' },
    
    { label: 'Students', icon: 'group', route: '/dashboard/students' },
    { label: 'Logout', icon: 'logout', isLogout: true },
  ];
}
