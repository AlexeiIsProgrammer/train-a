import { createActionGroup, emptyProps } from '@ngrx/store';
import { Routes } from '@type/roures.type';

export const RoutesActions = createActionGroup({
    source: 'Routes',
    events: {
        'Load all': emptyProps(),
        'Set all': (routes: Routes) => ({ routes }),
    },
});
