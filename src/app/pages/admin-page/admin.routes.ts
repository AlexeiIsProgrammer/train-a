import { Routes } from '@angular/router';
import { StationsPageComponent } from './stations-page/stations-page.component';
import { RoutePageComponent } from './route-page/route-page.component';
import { AdminPageComponent } from './admin-page.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';

export const AdminRoutes: Routes = [
    {
        path: '',
        component: AdminPageComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'stations',
            },
            {
                path: 'routes',
                component: RoutePageComponent,
            },
            {
                path: 'routes/:id',
                component: SchedulePageComponent,
            },
            {
                path: 'stations',
                component: StationsPageComponent,
            },
        ],
    },
];
