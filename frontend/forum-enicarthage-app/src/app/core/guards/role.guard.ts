import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.currentUser) { router.navigate(['/auth/login']); return false; }
  const allowedRoles: string[] = route.data['roles'] || [];
  if (allowedRoles.includes(auth.currentUser.role)) return true;
  // FIX: show access-denied page, not login page
  router.navigate(['/access-denied']);
  return false;
};
