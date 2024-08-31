import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { StationList } from '@type/station.type';
import { required } from '@shared/form-validators/required.validator';
import { Store } from '@ngrx/store';
import { SearchActions } from '@store/search/search.actions';
import { Station } from '@interface/station.interface';
import { getTomorrow } from '@shared/utils/get-tomorrow';
import { GetControlErrorMessagePipe } from '@shared/pipes/get-control-error-message/get-control-error-message.pipe';
import { futureDateValidator } from '@shared/form-validators/future-date.validator';
import { FilterPipe } from './pipe/filter.pipe';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        ReactiveFormsModule,
        MatNativeDateModule,
        MatButtonModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatIconModule,
        GetControlErrorMessagePipe,
        FilterPipe,
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
    readonly stationList = input<StationList>();

    readonly minDate: Date = getTomorrow();

    readonly searchForm = new FormGroup({
        startCity: new FormControl<string | Station>('', required()),
        endCity: new FormControl<string | Station>('', required()),
        date: new FormControl<string>('', [required(), futureDateValidator]),
        time: new FormControl<string>(''),
    });

    constructor(private readonly store: Store) {}

    onSubmit(): void {
        if (this.isCityStation(this.getStartCity) && this.isCityStation(this.getEndCity)) {
            const formattedDate = new Date(this.getDate);

            if (this.getTime) {
                const [hours, minutes] = this.getTime.split(':');

                formattedDate.setHours(Number(hours));
                formattedDate.setMinutes(Number(minutes));
            }

            this.store.dispatch(
                SearchActions.loadAll({
                    fromLatitude: this.getStartCity.latitude,
                    fromLongitude: this.getStartCity.longitude,
                    toLatitude: this.getEndCity.latitude,
                    toLongitude: this.getEndCity.longitude,
                    time: formattedDate.getTime(),
                }),
            );
        }
    }

    swapValues(): void {
        this.searchForm.patchValue({
            startCity: this.getEndCity,
            endCity: this.getStartCity,
        });
    }

    displayFn(option: Station): string {
        return option && option.city ? option.city : '';
    }

    isCityStation(city: Station | string | null): city is Station {
        return Boolean(typeof city !== 'string' && city?.id);
    }

    get getStartCity(): Station | string {
        return this.searchForm.get('startCity')?.value || '';
    }

    get getEndCity(): Station | string {
        return this.searchForm.get('endCity')?.value || '';
    }

    get getDate(): string {
        return this.searchForm.get('date')?.value || '';
    }

    get getTime(): string {
        return this.searchForm.get('time')?.value || '';
    }
}
