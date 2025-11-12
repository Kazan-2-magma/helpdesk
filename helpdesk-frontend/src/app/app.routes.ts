import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { HomeCompenent } from './home/home';
import { authGuard } from './core/guards/auth-guard';
import { NotFoundComponent } from './shared/components/not-found/not-found/not-found.component';
import { adminGuard } from './core/guards/admin-guard/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo : "auth/login", pathMatch: 'full' },
    {
        path: 'auth',
        loadChildren: () => import('../app/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'admin',
        canActivate: [authGuard,adminGuard],
        loadChildren: () => import('../app/features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
   
    // {
    //     path: 'agent',
    //     canActivate: [AuthGuard],
    //     loadChildren: () => import('./features/agent/agent.routes').then(m => m.AGENT_ROUTES)
    // },
    {
        path: 'user',
        canActivate: [authGuard],
        loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES)
    },
    { path: '**', component: NotFoundComponent },
];
