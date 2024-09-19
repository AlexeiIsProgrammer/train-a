import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { Station } from '@interface/station.interface';
import { Dictionary } from 'lodash';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Route } from '@interface/route.interface';
import { CarriagesStepperComponent } from '../../carriages-stepper/carriages-stepper.component';
import { StationStepperComponent } from '../../station-stepper/station-stepper.component';

@Component({
    selector: 'app-create-route',
    standalone: true,
    imports: [StationStepperComponent, CarriagesStepperComponent, MatButtonModule, MatDialogModule],
    templateUrl: './create-route.component.html',
    styleUrl: './create-route.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateRouteComponent {
    @Input({ required: true }) pathIds: number[] | undefined;
    @Input({ required: true }) carriages: string[] | undefined;
    @Input({ required: true }) carriagesTypes: string[] | undefined;
    @Input({ required: true }) stationEntities: Dictionary<Station | undefined> | undefined;

    @ViewChild(StationStepperComponent, { static: true }) stationStepper:
        | StationStepperComponent
        | undefined;

    @ViewChild(CarriagesStepperComponent, { static: true }) carriagesStepper:
        | CarriagesStepperComponent
        | undefined;

    get newRoute(): Pick<Route, 'carriages' | 'path'> {
        const { path } = this.stationStepper!;
        const { carriageTypes: carriages } = this.carriagesStepper!;

        return {
            carriages,
            path,
        };
    }
}
