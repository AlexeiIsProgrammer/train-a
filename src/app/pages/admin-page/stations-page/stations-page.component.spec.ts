import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { StationsPageComponent } from './stations-page.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './map/map.component';
import { Component } from '@angular/core';
import { StationRequest } from '@type/station.type';
import { StationsActions } from '@store/stations/stations.actions';

@Component({
    selector: 'app-map',
    standalone: true,
    template: '<div></div>',
    inputs: ['stationList'],
})
class MockMapComponent {}

describe('StationsPageComponent', () => {
    let store: MockStore;
    let spyStore: jest.SpyInstance;
    let component: StationsPageComponent;
    let fixture: ComponentFixture<StationsPageComponent>;

    beforeEach(async () => {
        const testBed = TestBed.configureTestingModule({
            imports: [StationsPageComponent, NoopAnimationsModule],
            providers: [provideMockStore()],
        });

        testBed.overrideComponent(StationsPageComponent, {
            remove: { imports: [MapComponent] },
            add: { imports: [MockMapComponent] },
        });

        await testBed.compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StationsPageComponent);
        component = fixture.componentInstance;

        store = TestBed.inject(MockStore);
        spyStore = jest.spyOn(store, 'dispatch');

        fixture.detectChanges();
    });

    test('should dispatch createOne action', () => {
        const req: StationRequest = {
            city: '',
            id: 1,
            latitude: 0,
            longitude: 0,
            relations: [2],
        };

        component.createOne(req);

        expect(spyStore).toHaveBeenCalledWith(StationsActions.createOne(req));
    });

    test('should dispatch removeOne action', () => {
        component.removeOne(1);

        expect(spyStore).toHaveBeenCalledWith(StationsActions.removeOne(1));
    });
});
