import { Route } from '@interface/route.interface';
import { Update } from '@ngrx/entity';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Routes } from '@type/roures.type';

export const RoutesActions = createActionGroup({
    source: 'Routes',
    events: {
        'Load all': emptyProps(),
        'Set all': (routes: Routes) => ({ routes }),
        'Update current': (route: Route) => ({ route }),
        'Remove current': (id: Route['id']) => ({ id }),
        'Create current': (route: Omit<Route, 'id'>) => ({
            route,
        }),
        'Update one': props<Update<Route>>(),
        'Remove one': (id: number) => ({ id }),
        'Add one': props<Route>(),
    },
});
