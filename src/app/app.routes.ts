import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { Login } from './pages/login/login';
import { TakeExam } from './pages/take-exam/take-exam';
import { Register } from './pages/register/register';

import { AddQuestion } from './pages/admin-dashboard/add-question/add-question';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  {
    path: 'take-exam',
    component: TakeExam,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: AdminDashboard,
    canActivate: [authGuard],
    children: [
      {
        path: 'exams',
        loadComponent: () =>
          import('./pages/admin-dashboard/all-exams/all-exams').then(m => m.AllExams),
      }
    ],
  },

  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  { path: 'q/add/:examId', component: AddQuestion, data: { isEditMode: false } },
  { path: 'q/edit/:id', component: AddQuestion, data: { isEditMode: true } },
  { path: '**', component: NotFound },
];
