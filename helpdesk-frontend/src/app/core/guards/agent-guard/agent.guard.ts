import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { inject } from "@angular/core";
import { ROLE } from "../../../shared/enum/enumes";

export const agentGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUser();

  if (!user || user.role !== ROLE.AGENT) {
    return router.createUrlTree(["/auth/login"]);
  }
  return true;
};
