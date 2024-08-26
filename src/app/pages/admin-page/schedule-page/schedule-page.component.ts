import {
    ChangeDetectionStrategy,
    Component,
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
import { RideComponent } from './ride/ride.component';
import { ScheduleService } from './service/schedule/schedule.service';
import { CreateRideComponent } from './create-ride/create-ride.component';

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
        readonly scheduleService: ScheduleService,
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

    remove(_id: Ride['rideId']) {
        // console.log(id)
    }
}
