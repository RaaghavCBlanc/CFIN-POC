import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);

  // localStorage-backed auth only exists in browser; avoid SSR hard-blocking.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const authService = inject(AuthService);
  if (authService.isAuthenticated()) {
    return true;
  }

  const router = inject(Router);
  const locale = route.paramMap.get('locale') || route.parent?.paramMap.get('locale') || 'en';

  return router.createUrlTree(['/', locale, 'sign-up'], {
    queryParams: {
      redirect: state.url,
    },
  });
};
