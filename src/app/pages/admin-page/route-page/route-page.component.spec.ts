import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { RoutePageComponent } from './route-page.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Route } from '@interface/route.interface';
import { RoutesActions } from '@store/routes/routes.actions';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EMPTY, of } from 'rxjs';
import { ConfirmDeleteComponent } from '@shared/components/confirm-delete/confirm-delete.component';
import { By } from '@angular/platform-browser';
import { CreateRouteComponent } from './route-list/create-route/create-route.component';

describe('RoutePageComponent', () => {
    let fixture: ComponentFixture<RoutePageComponent>;
    let storeDispatchSpy: jest.SpyInstance;
    let component: RoutePageComponent;
    let matDialog = {
        open: () => ({
            afterClosed: () => of<boolean | Route | null>(true),
            afterOpened: () => of(null),
        }),
    };
    let store: MockStore;

    const route: Route = {
        carriages: ['test'],
        id: 1,
        path: [2, 3],
    };

    beforeEach(async () => {
        const testBed = TestBed.configureTestingModule({
            imports: [RoutePageComponent, NoopAnimationsModule],
            providers: [
                provideMockStore(),
                {
                    provide: MatDialog,
                    useValue: matDialog,
                },
            ],
        });

        testBed.overrideComponent(RoutePageComponent, {
            remove: {
                imports: [MatDialogModule],
            },
        });

        await testBed.compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RoutePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        store = TestBed.inject(MockStore);
        storeDispatchSpy = jest.spyOn(store, 'dispatch');
    });

    it('should dispatch updateCurrent when call updateRoute', () => {
        component.updateRoute(route);

        expect(storeDispatchSpy).toHaveBeenCalledWith(RoutesActions.updateCurrent(route));
    });

    test('should dispatch createCurrent when call createRoute', () => {
        component.createRoute(route);

        expect(storeDispatchSpy).toHaveBeenCalledWith(RoutesActions.createCurrent(route));
    });

    test('should dispatch removeCurrent when call removeRoute', () => {
        component.removeRoute(1);

        expect(storeDispatchSpy).toHaveBeenCalledWith(RoutesActions.removeCurrent(1));
    });

    test('should open ConfirmDeleteComponent when remove route', () => {
        const spy = jest.spyOn(matDialog, 'open');

        component.removeRoute(1);

        expect(spy).toHaveBeenCalledWith(ConfirmDeleteComponent);
    });

    test('should open CreateRouteComponent', () => {
        const addRouteBtn = fixture.debugElement.query(By.css('[test-id="add-route-btn"]'));
        const spy = jest.spyOn(matDialog, 'open');
        const dialogConfig = {
            height: '90vh',
            maxWidth: '1440px',
        };

        expect(addRouteBtn).toBeTruthy();
        addRouteBtn.triggerEventHandler('click');

        expect(spy).toHaveBeenCalledWith(CreateRouteComponent, dialogConfig);
    });

    test('should call createRoute when route was created', () => {
        const spy = jest.spyOn(component, 'createRoute');

        matDialog.open = () => ({
            afterClosed: () => of(route),
            afterOpened: () => EMPTY,
        });

        component.openMatDialog();

        expect(spy).toHaveBeenCalledWith(route);
    });

    test('should not call createRoute when route wasn`t created', () => {
        const spy = jest.spyOn(component, 'createRoute');

        matDialog.open = () => ({
            afterClosed: () => of(null),
            afterOpened: () => EMPTY,
        });

        component.openMatDialog();

        expect(spy).not.toHaveBeenCalled();
    });
});
