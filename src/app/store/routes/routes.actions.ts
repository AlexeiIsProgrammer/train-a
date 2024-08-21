import { Route } from '@interface/route.interface';
import { Update } from '@ngrx/entity';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Routes } from '@type/roures.type';

export const RoutesActions = createActionGroup({
    source: 'Routes',
    events: {
        'Load all': emptyProps(),
        'Set all': (routes: Routes) => ({ routes }),
        'Update current': (route: Route, err: (err: unknown) => void) => ({ route, err }),
        'Remove current': (id: Route['id'], err: (err: unknown) => void) => ({ id, err }),
        'Create current': (route: Omit<Route, 'id'>, err: (err: unknown) => void) => ({
            route,
            err,
        }),
        'Update one': props<Update<Route>>(),
        'Remove one': (id: number) => ({ id }),
        'Add one': props<Route>(),
    },
});
