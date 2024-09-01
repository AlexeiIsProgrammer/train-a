import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Schedule } from '@type/schedule.type';
import { DatePipe } from '@angular/common';
import { GetCityNamePipe } from '@shared/pipes/get-city-name/get-city-name.pipe';
import { Station } from '@interface/station.interface';
import { Dictionary } from '@ngrx/entity';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PageParams } from '../page-params.type';

@Component({
    selector: 'app-schedule',
    standalone: true,
    imports: [DatePipe, GetCityNamePipe, MatDialogModule, MatButtonModule],
    templateUrl: './schedule.component.html',
    styleUrl: './schedule.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {
    @Input() pageParams: PageParams | null = null;
    @Input() schedule: Schedule[] | null = null;
    @Input() stationsEntities: Dictionary<Station> | null = null;
}
