import { inject, provideAppInitializer } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function provideAuthInitializer() {
    return provideAppInitializer(() => {
        const authService = inject(AuthService);
        return authService.loadUser();
    });
}

