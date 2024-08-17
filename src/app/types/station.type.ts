import { Station } from '@interface/station.interface';

export type StationList = Station[];

export type StationRequest = Omit<Station, 'connectedTo'> & { relations: number[] };
