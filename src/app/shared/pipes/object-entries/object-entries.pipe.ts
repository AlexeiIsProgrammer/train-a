import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'objectEntries',
    standalone: true,
})
export class ObjectEntriesPipe implements PipeTransform {
    transform<T extends NonNullable<unknown>, K extends keyof T>(obj: T) {
        return Object.entries(obj) as Array<[K, T[K]]>;
    }
}
