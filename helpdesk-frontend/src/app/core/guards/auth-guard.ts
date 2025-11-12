import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ROLE } from '../../shared/enum/enumes';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.loadUser()) {
    console.log("Is not Auth")
    return false
  }

  return true;
};
