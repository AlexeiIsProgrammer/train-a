import { IsSeatFreePipe } from './is-seat-free.pipe';

describe('IsSeatFreePipe', () => {
    it('create an instance', () => {
        const pipe = new IsSeatFreePipe();
        expect(pipe).toBeTruthy();
    });
});
