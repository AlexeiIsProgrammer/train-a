import { InputSignal } from '@angular/core';
import { Station } from '@interface/station.interface';
import { Dictionary } from 'lodash';
import { RouteListItem } from './route-list-item.type';

export interface DetailTemplateContext {
    routeListItem: RouteListItem;
    carriagesTypes: InputSignal<string[] | undefined>;
    stationEntities: InputSignal<Dictionary<Station> | undefined>;
}
