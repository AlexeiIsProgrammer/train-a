import { TestBed } from '@angular/core/testing';
import { SearchDetailService } from './search-detail.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of, pairwise, zip } from 'rxjs';
import { getMockRoute } from '@shared/utils/get-mock-route';
import { SelectedSeat } from '@pages/search-detail/selected-seat.interface';

describe('SearchDetailService', () => {
    let httpTestingController: HttpTestingController;
    let activatedRoute: ActivatedRoute;
    let service: SearchDetailService;

    const route = getMockRoute();

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                SearchDetailService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of({ get: () => route.rideId }),
                        queryParams: of({ from: 69, to: 4 }),
                    },
                },
            ],
        });

        service = TestBed.inject(SearchDetailService);
        activatedRoute = TestBed.inject(ActivatedRoute);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should provide correct value', done => {
        const seat: SelectedSeat = {
            carNum: 1,
            carType: 'type',
            fromCityIdx: 1,
            seatNum: 1,
        };

        service.selectedSeat$.pipe(pairwise()).subscribe(([initialValue, secondValue]) => {
            expect(initialValue).toBeNull();
            expect(secondValue).toEqual(seat);

            done();
        });
        service.setSeat(seat);
    });

    it('should close reservation', done => {
        const seat: SelectedSeat = {
            carNum: 1,
            carType: 'type',
            fromCityIdx: 1,
            seatNum: 1,
        };

        service.setSeat(seat);
        service.closeReservation();

        service.selectedSeat$.subscribe(seat => {
            expect(seat).toBeNull();
            done();
        });
    });

    test('should provide correct rideId', done => {
        zip([service.rideId$, activatedRoute.paramMap]).subscribe(([id, { get }]) => {
            expect(id).toBe(get('key'));

            done();
        });
    });

    test('should provide correct queryParams', done => {
        zip([service.query$, activatedRoute.queryParams]).subscribe(([query, params]) => {
            expect(query).toEqual(params);

            done();
        });
    });

    test('should should provide correct params and call loadRide', done => {
        const res = { rideId: 409, query: { from: 69, to: 4 } };
        const loadRideSpy = jest.spyOn(service, 'loadRide');

        service.pageParams$.subscribe(value => {
            expect(value).toEqual(res);
            expect(loadRideSpy).toHaveBeenCalledWith(res.rideId);
            done();
        });
    });

    test('should make get request', () => {
        service.loadRide(`${route.rideId}`);

        httpTestingController.expectOne({
            method: 'GET',
            url: `/api/search/${route.rideId}`,
        });
    });

    test('should provide correct rideDetail', done => {
        service.rideDetail$.subscribe(value => {
            expect(value).toEqual(route);
            done();
        });

        httpTestingController
            .expectOne({
                method: 'GET',
                url: `/api/search/${route.rideId}`,
            })
            .flush(route);
    });

    test('should make order', () => {
        const seat: SelectedSeat = {
            carNum: 1,
            carType: 'type',
            fromCityIdx: 1,
            seatNum: 1,
        };

        service.setSeat(seat);

        service.makeOrder();

        httpTestingController
            .expectOne({
                method: 'GET',
                url: `/api/search/${route.rideId}`,
            })
            .flush(route);

        httpTestingController
            .expectOne(({ url, method, body }) => {
                expect(url).toBe('/api/order');
                expect(method).toBe('POST');
                expect(body).toEqual({ rideId: 409, seat: 1, stationStart: 69, stationEnd: 4 });
                return true;
            })
            .flush({});
    });
});
