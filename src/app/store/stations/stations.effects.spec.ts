import { TestBed } from '@angular/core/testing';
import { removeStation } from './stations.effects';
import { of } from 'rxjs';
import { StationsActions } from './stations.actions';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { SnackBarMassageService } from '@shared/service/snack-bar-massage/snack-bar-massage.service';

describe('stations.effects', () => {
    let httpTestingController: HttpTestingController;
    let httpClient: HttpClient;

    const snackBarMassageService = {
        open: () => {},
    } as unknown as SnackBarMassageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });

        httpTestingController = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
    });

    test('should show success message', done => {
        const openSpy = jest.spyOn(snackBarMassageService, 'open');
        const action$ = of(StationsActions.removeOne(1));
        const testVal = { id: 1 };

        removeStation(action$, httpClient, snackBarMassageService).subscribe(() => {
            expect(openSpy).toHaveBeenCalledWith('Station was deleted', false);

            done();
        });

        httpTestingController.expectOne('/api/station/1').flush(testVal);
    });

    test('should show err message', done => {
        const openSpy = jest.spyOn(snackBarMassageService, 'open');
        const action$ = of(StationsActions.removeOne(1));

        removeStation(action$, httpClient, snackBarMassageService).subscribe({
            error: () => {
                expect(openSpy).toHaveBeenCalledWith(
                    'Cannot delete station with active rides',
                    true,
                );

                done();
            },
        });

        httpTestingController
            .expectOne('/api/station/1')
            .flush('test', { status: 400, statusText: 'Station is already used' });
    });

    test('should return remove one success action', done => {
        const action$ = of(StationsActions.removeOne(2));
        const testVal = { id: 2 };

        removeStation(action$, httpClient, snackBarMassageService).subscribe(val => {
            expect(val).toEqual({ ...testVal, type: '[Station] Remove one success' });
            done();
        });

        httpTestingController.expectOne('/api/station/2').flush(testVal);
    });
});
