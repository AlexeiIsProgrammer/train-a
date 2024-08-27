import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CarriageListComponent } from '@shared/components/carriage-list/carriage-list.component';
import { CommonModule, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { CarriagesFormComponent } from './carriages-form/carriages-form.component';
import { CreateCarriageButtonComponent } from './create-carriage-button/create-carriage-button.component';
import { CarriageFormService } from './carriages-form/services/carriage-form.service';

@Component({
    selector: 'app-carriages-page',
    standalone: true,
    templateUrl: './carriages-page.component.html',
    styleUrls: ['./carriages-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CarriageListComponent,
        CarriagesFormComponent,
        CreateCarriageButtonComponent,
        NgIf,
        CommonModule,
    ],
})
export class CarriagesPageComponent {
    isFormVisible$: Observable<boolean>;

    constructor(private readonly carriageFormService: CarriageFormService) {
        this.isFormVisible$ = this.carriageFormService.isFormVisible$;
    }

    openCreateForm() {
        this.carriageFormService.setEditForm(false);
        this.carriageFormService.setCreateForm(true);

        const initialData = {
            code: 'name',
            name: 'name',
            rows: 1,
            leftSeats: 1,
            rightSeats: 1,
        };

        this.carriageFormService.updateCarriageData(initialData);
    }
}
