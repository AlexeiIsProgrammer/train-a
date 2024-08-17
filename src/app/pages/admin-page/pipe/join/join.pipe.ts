import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'join',
    standalone: true,
})
export class JoinPipe implements PipeTransform {
    transform(arr: string[], separator: string): string {
        return arr.join(separator);
    }
}
