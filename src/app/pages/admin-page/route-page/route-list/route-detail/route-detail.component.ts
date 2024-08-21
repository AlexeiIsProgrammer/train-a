import { ChangeDetectionStrategy, Component, input, output, viewChild } from '@angular/core';
import { Station } from '@interface/station.interface';
import { Dictionary, omit } from 'lodash';
import { Route } from '@interface/route.interface';
import { MatButtonModule } from '@angular/material/button';
import { CarriagesStepperComponent } from '../../carriages-stepper/carriages-stepper.component';
import { StationStepperComponent } from '../../station-stepper/station-stepper.component';
import { RouteListItem } from '../route-list-item.type';

@Component({
    selector: 'app-route-detail',
    standalone: true,
    imports: [StationStepperComponent, CarriagesStepperComponent, MatButtonModule],
    templateUrl: './route-detail.component.html',
    styleUrl: './route-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteDetailComponent {
    readonly route = input<RouteListItem>();
    readonly carriagesTypes = input<string[]>();
    readonly stationEntities = input<Dictionary<Station>>();

    readonly update = output<Route>();

    private readonly stationStepper = viewChild.required(StationStepperComponent);
    private readonly carriagesStepper = viewChild.required(CarriagesStepperComponent);

    updateRoute(): void {
        this.update.emit(this.updatedRoute);
    }

    get canSave(): boolean {
        const isRouteValueChanged =
            JSON.stringify(omit(this.route(), 'position')) === JSON.stringify(this.updatedRoute);

        return isRouteValueChanged;
    }

    private get updatedRoute(): Route {
        const { path } = this.stationStepper();
        const { carriageTypes: carriages } = this.carriagesStepper();

        return {
            ...omit(this.route(), 'position'),
            carriages,
            path,
        };
    }
}
