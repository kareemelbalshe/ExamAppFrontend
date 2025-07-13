import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const isLoggedIn = authService.isAuthenticated();

  if (isLoggedIn) {
    return true;
  } else {
    return router.navigate(['/login']);
  }
};
