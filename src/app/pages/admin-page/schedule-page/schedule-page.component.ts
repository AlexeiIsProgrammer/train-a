import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Ride } from '@interface/ride.interface';
import { RideComponent } from './ride/ride.component';
import { ScheduleService } from './service/schedule/schedule.service';

@Component({
    selector: 'app-schedule-page',
    standalone: true,
    imports: [CommonModule, RideComponent, MatExpansionModule, MatIcon, MatButtonModule],
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

    constructor(
        private readonly title: Title,
        readonly scheduleService: ScheduleService,
    ) {}

    remove(_id: Ride['rideId']) {
        // console.log(id)
    }
}
