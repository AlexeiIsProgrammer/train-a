import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RideComponent } from './ride.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getMockRides } from '@shared/utils/get-mock-ride';
import { selectStationsEntities } from '@store/stations/stations.selectors';
import { getMockStationEntity } from '@shared/utils/get-mock-station';

describe('RideComponent', () => {
    let fixture: ComponentFixture<RideComponent>;
    let component: RideComponent;
    let store: MockStore;

    const ride = getMockRides();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RideComponent],
            providers: [provideMockStore()],
        }).compileComponents();

        fixture = TestBed.createComponent(RideComponent);
        component = fixture.componentInstance;

        store = TestBed.inject(MockStore);
        store.overrideSelector(selectStationsEntities, getMockStationEntity());

        fixture.componentRef.setInput('ride', ride.schedule[0]);
        fixture.componentRef.setInput('path', ride.path);

        fixture.detectChanges();
    });

    it('should should set in scheduleForm correct value', () => {
        const res = [
            {
                price: { carriage2: 266, carriage4: 178, carriage1: 114, carriage3: 146 },
                time: ['2024-08-15T13:27:10.000Z'],
            },
            {
                price: { carriage2: 225, carriage4: 659, carriage1: 568, carriage3: 893 },
                time: ['2024-08-17T17:33:10.804Z', '2024-08-17T16:58:10.804Z'],
            },
            { time: ['2024-08-18T09:50:10.804Z'], price: {} },
        ];

        expect(component.scheduleForm.value).toEqual(res);
    });
});
