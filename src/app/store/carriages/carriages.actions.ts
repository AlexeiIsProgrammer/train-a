import { createActionGroup, emptyProps } from '@ngrx/store';
import { Carriages } from '@type/carriages.type';

export const CarriageActions = createActionGroup({
    source: 'Carriages',
    events: {
        'Load all': emptyProps(),
        'Set all': (carriages: Carriages) => ({ carriages }),
    },
});
