import { CustomRoute } from '../interfaces/customRoute';

export const userRoutes: CustomRoute[] = [

    {
        path: 'home',
        title: 'Inicio',
        loadComponent: () => import('../user/page/home/home.component'),
    },
    {
        path: 'celula',
        title: 'Celula',
        loadComponent: () => import('../user/page/celula/celula.component'),
    },
    {
        path: 'map-celula',
        title: 'Mapa Celula',
        loadComponent: () => import('../../app/admin/pages/mapa/mapa.component'),
    },
    {
        path: 'informe',
        children: [
            {
                path: 'list',
                title: 'Informe Celula',
                loadComponent: () => import('../user/page/informe/list-informe/list-informe.component'),
            },
            {
                path: 'create',
                title: 'Informe Celula',
                loadComponent: () => import('../user/page/informe/form-informe/form-informe.component'),
            },
            {
                path: 'edit/:id',
                title: 'Informe Celula',
                loadComponent: () => import('../user/page/informe/form-informe/form-informe.component'),
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
        title: 'Miembros',
        loadComponent: () => import('../user/page/member/list-member/list-member.component'),
    },
    {
        path: 'lecciones',
        title: 'Lecciones',
        loadComponent: () => import('../user/page/lecciones/lecciones.component'),
    },
    /*{
        path: 'reporte',
        children: [
            {
                path: 'informe-celula',
                title: 'Informe Celula',
                loadComponent: () => import('../admin/pages/report/informe-celula/informe-celula.component'),
            },
            {
                path: 'celulas',
                title: 'Reporte Celulas',
                loadComponent: () => import('../admin/pages/report/celulas/celulas.component'),
            },
            {
                path: '',
                redirectTo: 'reporte',
                pathMatch: 'full',
            },
        ]
    },*/
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },

];
