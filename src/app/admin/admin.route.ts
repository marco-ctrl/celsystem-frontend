import { CustomRoute } from '../interfaces/customRoute';

export const adminRoutes: CustomRoute[] = [

    {
        path: 'home',
        title: 'Inicio',
        loadComponent: () => import('../admin/pages/home/home.component'),
    },
    {
        path: 'celula',
        title: 'Celula',
        loadComponent: () => import('../admin/pages/celula/list-celula/list-celula.component'),
    },
    {
        path: 'lider',
        title: 'Lider',
        loadComponent: () => import('../admin/pages/lider/list-lider/list-lider.component'),
    },
    {
        path: 'map-celula',
        title: 'Mapa Celula',
        loadComponent: () => import('../admin/pages/mapa/mapa.component'),
    },
    {
        path: 'informe',
        children: [
            {
                path: 'list',
                title: 'Informe Celula',
                loadComponent: () => import('../admin/pages/informe/list-informe/list-informe.component'),
            },
            {
                path: 'create',
                title: 'Informe Celula',
                loadComponent: () => import('../admin/pages/informe/form-informe/form-informe.component'),
            },
            {
                path: 'edit/:id',
                title: 'Informe Celula',
                loadComponent: () => import('../admin/pages/informe/form-informe/form-informe.component'),
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
        loadComponent: () => import('../admin/pages/miembro/list-miembros/list-miembros.component'),
    },
    {
        path: 'lecciones',
        title: 'Lecciones',
        loadComponent: () => import('../admin/pages/temas/list-temas/list-temas.component'),
    },
    {
        path: 'qr',
        title: 'QR',
        loadComponent: () => import('../admin/pages/qr/qr_list/qr_list.component'),
    },
    {
        path: 'reporte',
        children: [
            {
                path: 'informe-celula',
                title: 'Informe Celula',
                loadComponent: () => import('../admin/pages/report/informe-celula/informe-celula.component').then((m: any) => m.LayoutComponent || m.default),
            },
            {
                path: 'celulas',
                title: 'Reporte Celulas',
                loadComponent: () => import('../admin/pages/report/celulas/celulas.component').then((m: any) => m.LayoutComponent || m.default),
            },
            {
                path: '',
                redirectTo: 'reporte',
                pathMatch: 'full',
            },
        ]
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },

];
