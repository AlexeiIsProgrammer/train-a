import { TestBed } from '@angular/core/testing';

import { SearchDetailService } from './search-detail.service';

describe('SearchDetailService', () => {
    let service: SearchDetailService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SearchDetailService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
