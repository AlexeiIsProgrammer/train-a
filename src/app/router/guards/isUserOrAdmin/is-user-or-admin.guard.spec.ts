import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { isUserOrAdminGuard } from './is-user-or-admin.guard';

describe('isUserOrAdminGuard', () => {
    const executeGuard: CanMatchFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => isUserOrAdminGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeGuard).toBeTruthy();
    });
});
