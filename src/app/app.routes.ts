import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { Login } from './pages/login/login';
import { TakeExam } from './pages/take-exam/take-exam';
import { Register } from './pages/register/register';
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
  { path: 'dashboard', component: AdminDashboard, canActivate: [authGuard] },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  { path: '**', component: NotFound },
];
