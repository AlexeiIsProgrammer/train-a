/* eslint-disable rxjs/no-unsafe-takeuntil */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, withLatestFrom, filter, takeUntil, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GetCityNamePipe } from '@shared/pipes/get-city-name/get-city-name.pipe';
import { Store } from '@ngrx/store';
import { selectStationsEntities } from '@store/stations/stations.selectors';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { selectCarriagesEntities } from '@store/carriages/carriages.selector';
import { SearchDetailService } from './service/search-detail/search-detail.service';
import { RideInfoComponent } from './ride-info/ride-info.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { CarListComponent } from './car-list/car-list.component';
import { BookingSeatModalComponent } from './booking-seat-modal/booking-seat-modal.component';

@Component({
    selector: 'app-search-detail',
    standalone: true,
    imports: [
        RideInfoComponent,
        GetCityNamePipe,
        CommonModule,
        ScheduleComponent,
        MatDialogModule,
        CarListComponent,
        BookingSeatModalComponent,
    ],
    templateUrl: './search-detail.component.html',
    styleUrl: './search-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SearchDetailService],
})
export class SearchDetailComponent {
    readonly fromCityIdx$ = new Subject<number>();
    readonly stationsEntities$ = this.store.select(selectStationsEntities);
    readonly carriagesEntities$ = this.store.select(selectCarriagesEntities);

    readonly carriagesSeats$ = this.detailService.rideDetail$.pipe(
        filter(Boolean),
        withLatestFrom(this.carriagesEntities$),
        map(([{ carriages }, entities]) => {
            let count = 1;

            const seats = carriages.reduce((acc: Array<[number, number]>, carName) => {
                const car = entities[carName];

                if (car) {
                    const { leftSeats, rightSeats, rows } = car;
                    const seatCount = (leftSeats + rightSeats) * rows;

                    acc.push([count, seatCount + count]);

                    count += seatCount;
                }

                return acc;
            }, []);

            return seats;
        }),
    );

    readonly dateOfDeparture$ = this.detailService.rideDetail$.pipe(
        filter(Boolean),
        withLatestFrom(this.detailService.pageParams$),
        map(([{ path, schedule }, { query }]) => {
            const cityIdx = path.indexOf(query.from);
            const departureTime = schedule.segments.at(cityIdx)?.time.at(0);

            this.fromCityIdx$.next(cityIdx);

            return departureTime ?? null;
        }),
    );

    constructor(
        private readonly store: Store,
        private readonly matDialog: MatDialog,
        readonly detailService: SearchDetailService,
    ) {}

    readonly total$ = this.detailService.selectedSeat$.pipe(
        filter(Boolean),
        withLatestFrom(
            this.detailService.rideDetail$.pipe(filter(Boolean)),
            this.detailService.query$.pipe(filter(Boolean)),
        ),
        map(([{ fromCityIdx, carType }, { schedule, path }, { to }]) => {
            const toCityIdx = path.indexOf(to);
            const rideCitySegments = schedule.segments.slice(fromCityIdx, toCityIdx);
            const total = rideCitySegments.reduce((acc: number, { price }) => {
                const sum = acc + price[carType];

                return sum;
            }, 0);

            return total;
        }),
    );

    openDialog(): void {
        const dialogRef = this.matDialog.open(ScheduleComponent, {
            maxWidth: '500px',
            width: '100%',
        });
        const { componentRef } = dialogRef;

        dialogRef
            .afterOpened()
            .pipe(
                takeUntil(dialogRef.afterClosed()),
                withLatestFrom(
                    this.detailService.pageParams$,
                    this.detailService.schedule$,
                    this.stationsEntities$,
                ),
            )
            .subscribe(([, pageParams, schedule, stationsEntities]) => {
                componentRef?.setInput('schedule', schedule);
                componentRef?.setInput('pageParams', pageParams);
                componentRef?.setInput('stationsEntities', stationsEntities);
            });
    }
}
