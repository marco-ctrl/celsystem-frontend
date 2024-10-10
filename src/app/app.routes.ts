import { Routes } from '@angular/router';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from './auth/guards';

export const routes: Routes = [
    {
        path:'login',
        canActivate: [ isNotAuthenticatedGuard ],
        loadComponent: () => import('./auth/pages/login/login.component')
    },
    {
        path:'admin',
        canActivate: [ isAuthenticatedGuard ],
        loadComponent: () => import('./admin/pages/layouts/layout.component'),
        children: [
            {
                path: 'home',
                title: 'Inicio',
                loadComponent: () => import('./admin/pages/dashboard/dashboard.component'),
            },
            {
                path: 'lider',
                title: 'Lider',
                loadComponent: () => import('./admin/pages/lider/lider-list/lider-list.component'),
            },
            {
                path: 'celula',
                title: 'Celula',
                loadComponent: () => import('./admin/pages/celula/celula-list/celula-list.component'),
            },
            {
                path: 'map-celula',
                title: 'Mapa Celula',
                loadComponent: () => import('./admin/pages/map/map-celula/map-celula.component'),
            },
            {
                path: 'informe',
                children: [
                    {
                        path: 'list',
                        title: 'Informe Celula',
                        loadComponent: () => import('./admin/pages/informe/list-informe/list-informe.component'),
                    },
                    {
                        path: 'create',
                        title: 'Informe Celula',
                        loadComponent: () => import('./admin/pages/informe/form-informe/form-informe.component'),
                    },
                    {
                        path: 'edit/:id',
                        title: 'Informe Celula',
                        loadComponent: () => import('./admin/pages/informe/form-informe/form-informe.component'),
                    },
                    {
                        path: '',
                        redirectTo: 'list',
                        pathMatch: 'full',
                    },
                ]
            },
            {
                path: 'member',
                children: [
                    {
                        path: 'list',
                        title: 'Membresia',
                        loadComponent: () => import('./admin/pages/miembros/member-list/member-list.component'),
                    },
                    {
                        path: 'create',
                        title: 'Membresia',
                        loadComponent: () => import('./admin/pages/miembros/member-form/member-form.component'),
                    },
                    {
                        path: 'edit/:id',
                        title: 'Membresia',
                        loadComponent: () => import('./admin/pages/miembros/member-form/member-form.component'),
                    },
                    {
                        path: '',
                        redirectTo: 'list',
                        pathMatch: 'full',
                    },
                ]
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            },
        ]
    },
    {
        path:'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component'),
        children: [
            {
                path: 'change-detection',
                title: 'Change Detection',
                loadComponent: () => import('./dashboard/pages/change-detection/change-detection.component'),
            },
            {
                path: 'control-flow',
                title: 'Control Flow',
                loadComponent: () => import('./dashboard/pages/control-flow/control-flow.component'),
            },
            {
                path: 'defer-options',
                title: 'Defer Options',
                loadComponent: () => import('./dashboard/pages/defer-options/defer-options.component'),
            },
            {
                path: 'defer-views',
                title: 'Defer Views',
                loadComponent: () => import('./dashboard/pages/defer-views/defer-views.component'),
            },
            {
                path: 'user/:id',
                title: 'User View',
                loadComponent: () => import('./dashboard/pages/user/user.component'),
            },
            {
                path: 'user-list',
                title: 'User List',
                loadComponent: () => import('./dashboard/pages/users/users.component'),
            },
            {
                path: 'view-transition-1',
                title: 'View Transition 1',
                loadComponent: () => import('./dashboard/pages/view-transition/view-transition1.component'),
            },
            {
                path: 'view-transition-2',
                title: 'View Transition 2',
                loadComponent: () => import('./dashboard/pages/view-transition/view-transition2.component'),
            },
            {
                path: 'inputs-outputs',
                title: 'Inputs Outputs',
                loadComponent: () => import('./dashboard/pages/input-ouput/input-ouput.component'),
            },
            {
                path: 'material',
                title: 'Material Component',
                loadComponent: () => import('./dashboard/pages/material/material.component'),
            },
            {
                path: '',
                redirectTo: 'control-flow',
                pathMatch: 'full',
            },
            
        ],
    },
    {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full',
    }
];
