import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';
import { ROLE } from '../../../shared/enum/enumes';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router);

  const user = authService.getUser();

  if (user.role !== ROLE.ADMIN) {
    return router.createUrlTree(["/auth/login"]);
  }
  return true;
};
