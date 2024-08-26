import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    Input,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Ride } from '@interface/ride.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '@shared/components/confirm-delete/confirm-delete.component';
import { catchError, EMPTY, exhaustMap, filter, map, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CreateRideComponent } from './create-ride/create-ride.component';
import { ScheduleService } from './service/schedule/schedule.service';
import { RideComponent } from './ride/ride.component';

@Component({
    selector: 'app-schedule-page',
    standalone: true,
    imports: [
        CommonModule,
        RideComponent,
        MatExpansionModule,
        MatIcon,
        MatButtonModule,
        CreateRideComponent,
    ],
    templateUrl: './schedule-page.component.html',
    styleUrl: './schedule-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ScheduleService],
})
export class SchedulePageComponent {
    @Input() set id(id: string) {
        this.title.setTitle(`Route №${id}`);
        this.scheduleService.loadSchedule(Number(id));
    }

    @ViewChild('saveBtn') saveBtnTemplate!: TemplateRef<{ $implicit: Ride }>;
    @ViewChildren('saveBtnContainer', { read: ViewContainerRef })
    saveBtnContainers!: QueryList<ViewContainerRef>;

    constructor(
        private readonly title: Title,
        private readonly matDialog: MatDialog,
        readonly scheduleService: ScheduleService,
        private readonly destroyRef: DestroyRef,
        private readonly activatedRoute: ActivatedRoute,
    ) {}

    addSaveBtn(viewContainerIdx: number, ride: Ride): void {
        const viewContainer = this.saveBtnContainers?.get(viewContainerIdx);

        viewContainer?.clear();
        viewContainer?.createEmbeddedView(this.saveBtnTemplate, {
            $implicit: ride,
        });
    }

    save(_ride: Ride): void {
        // console.log(_ride)
    }

    remove(id: Ride['rideId']) {
        const dialogRef = this.matDialog.open(ConfirmDeleteComponent);

        dialogRef
            .afterClosed()
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                filter(Boolean),
                exhaustMap(() =>
                    this.scheduleService.removeById(id).pipe(
                        catchError(() => EMPTY),
                        switchMap(() => this.activatedRoute.paramMap),
                        map(param => param.get('id')),
                        filter(Boolean),
                        tap(_rideId => {
                            // this.scheduleService.loadSchedule(Number(id));
                            this.scheduleService.fakeRideRemove(id);
                        }),
                    ),
                ),
            )
            .subscribe();
    }
}
