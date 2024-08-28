import { Routes } from '@angular/router';
import { PageNotFoundComponent } from '@pages/page-not-found/page-not-found.component';
import { isAdminGuard } from './guards/isAdmin/is-admin.guard';
import { isGuestGuard } from './guards/isGuest/is-guest.guard';

export const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () =>
            import('@pages/admin-page/admin.routes').then(({ AdminRoutes }) => AdminRoutes),
        canMatch: [isAdminGuard],
    },
    {
        path: 'signup',
        loadComponent: () =>
            import('@pages/sing-up/sing-up.component').then(
                ({ SingUpComponent }) => SingUpComponent,
            ),
        canMatch: [isGuestGuard],
    },
    {
        path: 'signin',
        loadComponent: () =>
            import('@pages/login/login.component').then(({ LoginComponent }) => LoginComponent),
        canMatch: [isGuestGuard],
    },
    {
        path: '**',
        component: PageNotFoundComponent,
    },
];
