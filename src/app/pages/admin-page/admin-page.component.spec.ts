import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AdminPageComponent } from './admin-page.component';
import { RoutesActions } from '@store/routes/routes.actions';

describe('AdminPageComponent', () => {
    let fixture: ComponentFixture<AdminPageComponent>;
    let component: AdminPageComponent;
    let store: MockStore;
    let dispatchSpy: jest.SpyInstance;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminPageComponent],
            providers: [provideMockStore()],
        }).compileComponents();

        store = TestBed.inject(MockStore);
        dispatchSpy = jest.spyOn(store, 'dispatch');

        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should dispatch action loadAll', () => {
        expect(dispatchSpy).toHaveBeenCalledWith(RoutesActions.loadAll());
    });
});
