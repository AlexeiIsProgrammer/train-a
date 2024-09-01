import { GetCityNamePipe } from './get-city-name.pipe';

describe('GetCityNamePipe', () => {
    it('create an instance', () => {
        const pipe = new GetCityNamePipe();
        expect(pipe).toBeTruthy();
    });
});
