import { Route } from '@interface/route.interface';
import { Update } from '@ngrx/entity';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Routes } from '@type/roures.type';

export const RoutesActions = createActionGroup({
    source: 'Routes',
    events: {
        'Load all': emptyProps(),
        'Set all': (routes: Routes) => ({ routes }),
        'Update one': props<{ update: Update<Route> }>(),
    },
});
