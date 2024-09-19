import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ScheduleService } from './schedule.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { zip } from 'rxjs';
import { getMockRides } from '@shared/utils/get-mock-ride';
import { Component } from '@angular/core';

describe('ScheduleService', () => {
    let httpTestingController: HttpTestingController;
    let service: ScheduleService;
    let router: Router;

    const rides = getMockRides();

    @Component({})
    class Test {}

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ScheduleService,
                provideRouter([
                    {
                        path: '**',
                        component: Test,
                    },
                ]),
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });

        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(ScheduleService);
        router = TestBed.inject(Router);
    });

    it('should load rides', done => {
        const { schedule$, path$, carriages$ } = service;

        service.loadSchedule(rides.id);

        zip(schedule$, path$, carriages$).subscribe(([schedule, path, carriages]) => {
            expect({
                schedule,
                path,
                carriages,
                id: rides.id,
            }).toEqual(rides);
            done();
        });

        httpTestingController.expectOne(`/api/route/${rides.id}`).flush(rides);
    });

    test('should redirect to 404 when an error occurs', fakeAsync(() => {
        service.loadSchedule(999);

        httpTestingController
            .expectOne({
                method: 'GET',
                url: `/api/route/999`,
            })
            .flush('', { status: 400, statusText: '' });

        flush();
        expect(router.url).toBe('/404');
    }));

    test('should update ride', () => {
        const { rideId, segments } = rides.schedule[0];
        service.updateRide(rideId, segments).subscribe();

        httpTestingController.expectOne({
            method: 'PUT',
            url: `/api/route/${NaN}/ride/${rideId}`,
        });
    });

    test('should remove ride by id', () => {
        service.removeById(rides.id).subscribe();

        httpTestingController.expectOne({
            method: 'DELETE',
            url: `/api/route/${rides.id}`,
        });
    });

    test('should create ride', () => {
        const { segments } = rides.schedule[0];
        service.createRide(segments).subscribe();

        httpTestingController.expectOne(({ url, body, method }) => {
            expect(url).toBe(`/api/route/${NaN}/ride`);
            expect(body).toEqual({ segments });
            expect(method).toBe('POST');
            return true;
        });
    });
});
