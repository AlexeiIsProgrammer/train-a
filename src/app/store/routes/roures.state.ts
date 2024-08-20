import { Route } from '@interface/route.interface';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const ROUTES_FEATURE = 'routes';

export type RoutesState = EntityState<Route>;

export const routesAdapter = createEntityAdapter<Route>();

export const routesInitialState = routesAdapter.getInitialState();
