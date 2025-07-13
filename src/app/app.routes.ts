import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { Login } from './pages/login/login';
import { TakeExam } from './pages/take-exam/take-exam';
import { Register } from './pages/register/register';
import { AddQuestion } from './pages/admin-dashboard/add-question/add-question';
export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  {
    path: 'take-exam',
    component: TakeExam,
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
