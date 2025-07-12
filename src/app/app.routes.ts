import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  {
    path: 'take-exam',
    loadChildren: () =>
      import('./pages/take-exam/take-exam').then((m) => m.TakeExam),
  },
  { path: '**', component: NotFound },
];
