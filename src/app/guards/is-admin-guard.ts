import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  if (authService.isAdmin()) {
    return true;
  } else {
    return false;
  }
};
