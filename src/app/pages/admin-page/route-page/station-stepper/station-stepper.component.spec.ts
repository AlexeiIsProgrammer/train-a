import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { StationStepperComponent } from './station-stepper.component';
import { provideMockStore } from '@ngrx/store/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StationsState } from '@store/stations/stations.state';

describe('StationStepperComponent', () => {
    let component: StationStepperComponent;
    let fixture: ComponentFixture<StationStepperComponent>;
    let stationEntities = {
        1: {
            city: 'city1',
            id: 1,
            latitude: 0,
            longitude: 0,
            connectedTo: [
                {
                    distance: 0,
                    id: 2,
                },
            ],
        },
        2: {
            city: 'city2',
            id: 2,
            latitude: 0,
            longitude: 0,
            connectedTo: [
                {
                    distance: 0,
                    id: 1,
                },
            ],
        },
        3: {
            city: 'city3',
            id: 3,
            latitude: 0,
            longitude: 0,
            connectedTo: [
                {
                    distance: 0,
                    id: 1,
                },
            ],
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StationStepperComponent, NoopAnimationsModule],
            providers: [provideMockStore()],
        }).compileComponents();

        fixture = TestBed.createComponent(StationStepperComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('pathIds', []);
        fixture.componentRef.setInput('stationEntities', stationEntities);

        fixture.detectChanges();
    });

    it('should refresh stationsForm when pathIds changed', () => {
        const { stationsForm } = component;

        expect(stationsForm).toHaveLength(0);

        fixture.componentRef.setInput('pathIds', [1, 2]);
        fixture.detectChanges();

        expect(stationsForm).toHaveLength(2);
    });

    test('should add control', () => {
        const { stationsForm } = component;

        expect(stationsForm).toHaveLength(0);
        component.addOne(0, 1);
        component.addOne(1, 2);
        expect(stationsForm).toHaveLength(2);

        component.addOne(0, 3);
        expect(stationsForm.controls.at(1)?.value).toBe(3);

        component.addOne(2, 4);
        expect(stationsForm.controls.at(3)?.value).toBe(4);
    });

    test('should edit control', () => {
        const { stationsForm } = component;

        expect(stationsForm).toHaveLength(0);
        component.addOne(0, 1);
        expect(stationsForm.controls.at(0)?.value).toBe(1);

        component.editOne(0, 111);
        expect(stationsForm.controls.at(0)?.value).toBe(111);
    });

    test('should remove control', () => {
        const { stationsForm } = component;

        component.addOne(0, 1);
        component.addOne(1, 2);
        component.addOne(2, 3);
        expect(stationsForm).toHaveLength(3);

        component.removeOne(1);

        expect(stationsForm).toHaveLength(2);
        expect(stationsForm.controls.at(1)?.value).toBe(3);

        component.removeOne(0);
        component.removeOne(0);
        component.removeOne(0);
        expect(stationsForm).toHaveLength(0);
    });

    test('stationList should contain uniq station', () => {
        expect(component.stationList()).toEqual(Object.values(stationEntities));

        component.addOne(0, 2);

        expect(component.stationList()).not.toContain(stationEntities[2]);
    });
});
