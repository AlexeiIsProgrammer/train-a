import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () =>
            import('@pages/admin-page/admin.routes').then(({ AdminRoutes }) => AdminRoutes),
    },
    {
        path: 'singup',
        loadComponent: () =>
            import('@pages/sing-up/sing-up.component').then(
                ({ SingUpComponent }) => SingUpComponent,
            ),
    },
];
