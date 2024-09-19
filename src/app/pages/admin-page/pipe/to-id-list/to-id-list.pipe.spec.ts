import { ConnectedTo } from '@interface/station.interface';
import { ToIdListPipe } from './to-id-list.pipe';

describe('ToIdListPipe', () => {
    let pipe: ToIdListPipe;

    beforeEach(() => {
        pipe = new ToIdListPipe();
    });
    it('should return valid value', () => {
        const { transform } = pipe;
        expect(transform([{ id: 1 }, { id: 2 }, { id: 3 }] as ConnectedTo[])).toEqual([1, 2, 3]);
    });
});
