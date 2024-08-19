import { Carriage } from '@interface/carriage.interface';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const CARRIAGES_FEATURE = 'carriages';

export type CarriagesState = EntityState<Carriage>;

export const carriageAdapter = createEntityAdapter<Carriage>({ selectId: ({ name }) => name });

export const carriageInitialState = carriageAdapter.getInitialState();
