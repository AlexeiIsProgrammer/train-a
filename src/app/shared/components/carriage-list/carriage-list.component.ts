import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllCarriages } from '@store/carriages/carriages.selector';
import { CommonModule, NgFor } from '@angular/common';
import { CarriageFormService } from '@pages/admin-page/carriages-page/carriages-form/services/carriage-form.service';
import { Carriage } from '@interface/carriage.interface';
import { CarriageComponent } from '../carriage/carriage.component';
import { EditComponent } from '../edit/edit.component';

@Component({
    selector: 'app-carriage-list',
    standalone: true,
    imports: [CarriageComponent, NgFor, CommonModule, EditComponent],
    templateUrl: './carriage-list.component.html',
    styleUrls: ['./carriage-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriageListComponent {
    readonly carriages$ = this.store.select(selectAllCarriages);

    constructor(
        private readonly store: Store,
        private readonly carriageFormService: CarriageFormService,
    ) {}

    openEditForm(carriage: Carriage) {
        this.carriageFormService.setEditForm(true);
        this.carriageFormService.setCreateForm(false);

        this.carriageFormService.updateCarriageData(carriage);
        this.scrollToForm();
    }

    scrollToForm() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
}
