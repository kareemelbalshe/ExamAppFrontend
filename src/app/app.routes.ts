import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { Login } from './pages/login/login';
import { TakeExam } from './pages/take-exam/take-exam';
import { Register } from './pages/register/register';

import { AddQuestion } from './pages/admin-dashboard/add-question/add-question';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { authGuard } from './guards/auth-guard';
import { EditQuestion } from './pages/admin-dashboard/edit-question/edit-question';
import { MainLayout } from './layout/main-layout/main-layout';
import { ShowResult } from './pages/show-result/show-result';
import { isAdminGuard } from './guards/is-admin-guard';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'register',
        component: Register,
      },
      { path: 'profile', component: Profile, canActivate: [authGuard] },
      {
        path: 'show-result/:resultId',
        component: ShowResult,
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'take-exam/:examId',
    component: TakeExam,
    canActivate: [authGuard],
  },

  {
    path: 'dashboard',
    component: AdminDashboard,
    canActivate: [authGuard, isAdminGuard],
    children: [
      {
        path: 'exams',
        loadComponent: () =>
          import('./pages/admin-dashboard/all-exams/all-exams').then(
            (m) => m.AllExams
          ),
      },
      {
        path: 'question/add/:examId',
        component: AddQuestion,
        data: { isEditMode: false },
      },
      {
        path: 'question/edit/:examId',
        component: EditQuestion,
        data: { isEditMode: true },
      },
    ],
  },
  { path: '**', component: NotFound },
];
