import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'join',
    standalone: true,
})
export class JoinPipe implements PipeTransform {
    transform(arr: unknown, separator: string): string | undefined {
        if (arr instanceof Array) {
            return arr.join(separator);
        }

        return undefined;
    }
}
