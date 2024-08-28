import { Carriage } from '@interface/carriage.interface';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const CARRIAGES_FEATURE = 'carriages';

export type CarriagesState = EntityState<Carriage>;

export const carriageAdapter = createEntityAdapter<Carriage>({ selectId: ({ code }) => code });

export const carriageInitialState = carriageAdapter.getInitialState();
