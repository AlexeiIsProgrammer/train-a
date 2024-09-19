import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchDetailComponent } from './search-detail.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SearchDetailService } from './service/search-detail/search-detail.service';
import { of } from 'rxjs';
import { getMockRoute } from '@shared/utils/get-mock-route';
import { selectStationsEntities } from '@store/stations/stations.selectors';
import { getMockStationEntity } from '@shared/utils/get-mock-station';
import { selectCarriagesEntities } from '@store/carriages/carriages.selector';
import { getMockCarriages } from '@shared/utils/get-mock-carriages';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ScheduleComponent } from './schedule/schedule.component';

describe('SearchDetailComponent', () => {
    let fixture: ComponentFixture<SearchDetailComponent>;
    let component: SearchDetailComponent;
    let store: MockStore;

    let matDialog = {
        open: () => ({
            afterClosed: () => of<boolean | null>(true),
            afterOpened: () => of(null),
        }),
    };

    const route = getMockRoute();

    beforeEach(async () => {
        const testBet = TestBed.configureTestingModule({
            imports: [SearchDetailComponent],
            providers: [provideMockStore()],
        });

        testBet.overrideComponent(SearchDetailComponent, {
            remove: {
                imports: [MatDialogModule],
                providers: [SearchDetailService, ActivatedRoute],
            },
            add: {
                providers: [
                    {
                        provide: MatDialog,
                        useValue: matDialog,
                    },
                    {
                        provide: SearchDetailService,
                        useValue: {
                            rideDetail$: of(route),
                            selectedSeat$: of({
                                seatNum: 1,
                                carNum: 1,
                                fromCityIdx: 1,
                                carType: 'carriage2',
                            }),
                            query$: of({ from: 69, to: 4 }),
                            schedule$: of(route.schedule),
                            pageParams$: of({
                                rideId: route.rideId,
                                query: of({ from: 69, to: 4 }),
                            }),
                        },
                    },
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            paramMap: of(route.rideId),
                            queryParams: of({ from: 69, to: 4 }),
                        },
                    },
                ],
            },
        });

        await testBet.compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchDetailComponent);
        component = fixture.componentInstance;

        store = TestBed.inject(MockStore);

        store.overrideSelector(selectStationsEntities, getMockStationEntity());
        store.overrideSelector(selectCarriagesEntities, getMockCarriages().carriages.entities);

        fixture.detectChanges();
    });

    it('should provide correct seats', done => {
        const res = [
            [1, 65],
            [65, 185],
            [185, 240],
            [240, 320],
        ];

        component.carriagesSeats$.subscribe(seats => {
            expect(seats).toEqual(res);
            done();
        });
    });

    test('should provide correct departure day', done => {
        component.dateOfDeparture$.subscribe(date => {
            expect(date).toBe('2024-09-25T16:14:05.205Z');
            done();
        });
    });

    test('should provide correct total price', done => {
        component.total$.subscribe(total => {
            expect(total).toBe(1335);
            done();
        });
    });

    test('should open matDialog with ScheduleComponent when call openDialog fn', () => {
        const openSpy = jest.spyOn(matDialog, 'open');

        component.openDialog();

        expect(openSpy).toHaveBeenCalledWith(ScheduleComponent, {
            maxWidth: '500px',
            width: '100%',
        });
    });
});
