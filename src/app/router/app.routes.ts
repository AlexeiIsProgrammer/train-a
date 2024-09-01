import { Routes } from '@angular/router';
import { PageNotFoundComponent } from '@pages/page-not-found/page-not-found.component';
import { isAdminGuard } from './guards/isAdmin/is-admin.guard';
import { isGuestGuard } from './guards/isGuest/is-guest.guard';
import { isUserOrAdminGuard } from './guards/isUserOrAdmin/is-user-or-admin.guard';

export const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () =>
            import('@pages/admin-page/admin.routes').then(({ AdminRoutes }) => AdminRoutes),
        canMatch: [isAdminGuard],
    },
    {
        path: 'profile',
        loadComponent: () =>
            import('@pages/profile-page/profile-page.component').then(
                ({ ProfilePageComponent }) => ProfilePageComponent,
            ),
        canMatch: [isUserOrAdminGuard],
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
        path: 'trip/:rideId',
        loadComponent: () =>
            import('@pages/search-detail/search-detail.component').then(
                ({ SearchDetailComponent }) => SearchDetailComponent,
            ),
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
