import { Routes } from '@angular/router';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from './auth/guards';
import { adminRoutes } from './admin/admin.route';
import { userRoutes } from './user/user.route';

export const routes: Routes = [
    
    {
        path:'login',
        canActivate: [ isNotAuthenticatedGuard ],
        loadComponent: () => import('./auth/pages/login/login.component')
        .then((m: any) => m.LoginComponent || m.default),
    },
    {
        path:'admin',
        canActivate: [ isAuthenticatedGuard ],
        loadComponent: () => import('./admin/pages/layout/layout.component').then((m: any) => m.LayoutComponent || m.default),
        children: adminRoutes
    },
    {
        path:'app',
        canActivate: [ isAuthenticatedGuard ],
        loadComponent: () => import('./user/page/layout/layout.component').then((m: any) => m.LayoutComponent || m.default),
        children: userRoutes
    },
    {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full',
    }
];
