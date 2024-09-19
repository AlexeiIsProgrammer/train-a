import { JoinPipe } from './join.pipe';

describe('JoinPipe', () => {
    let pipe: JoinPipe;

    beforeEach(() => {
        pipe = new JoinPipe();
    });

    it('should return valid value', () => {
        const { transform } = pipe;

        expect(transform(123, '-')).toBeUndefined();
        expect(transform([1, 2, 3], '-')).toBe('1-2-3');
    });
});
