import { Carriage } from '@interface/carriage.interface';
import { createActionGroup, emptyProps } from '@ngrx/store';
import { Carriages } from '@type/carriages.type';

export const CarriageActions = createActionGroup({
    source: 'Carriages',
    events: {
        'Load all': emptyProps(),
        'Set all': (carriages: Carriages) => ({ carriages }),
        'Add one': (carriage: Carriage) => ({ carriage }),
        'Add one success': (carriage: Carriage) => ({ carriage }),
        'Update one': (code: string, carriage: Carriage) => ({ code, carriage }),
        'Update one success': (code: string, changes: Carriage) => ({ code, changes }),
    },
});
