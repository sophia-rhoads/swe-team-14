import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.services';

export const adminGuard: CanActivateFn = () => {

    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAdmin()) {
        return true; // allow access
    }

    // block access
    router.navigateByUrl('/');
    return false;
};