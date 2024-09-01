import { Routes } from '@angular/router';
import { PageNotFoundComponent } from '@pages/page-not-found/page-not-found.component';
import { isAdminGuard } from './guards/isAdmin/is-admin.guard';
import { isGuestGuard } from './guards/isGuest/is-guest.guard';
import { isUserGuard } from './guards/isUser/is-user.guard';

export const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () =>
            import('@pages/admin-page/admin.routes').then(({ AdminRoutes }) => AdminRoutes),
        canMatch: [isAdminGuard],
    },
    {
        path: 'profile',
        loadChildren: () =>
            import('@pages/profile-page/profile-page.component').then(
                ({ ProfilePageComponent }) => ProfilePageComponent,
            ),
        canMatch: [isUserGuard],
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
        path: '',
        loadComponent: () =>
            import('@pages/home-page/home-page.component').then(
                ({ HomePageComponent }) => HomePageComponent,
            ),
    },
    {
        path: '**',
        component: PageNotFoundComponent,
    },
];
