import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Observable, map, startWith } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { StationList } from '@type/station.type';
import { required } from '@shared/form-validators/required.validator';
import { Store } from '@ngrx/store';
import { SearchActions } from '@store/search/search.actions';

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
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
    readonly stationList = input<StationList>();

    readonly searchForm = this.fb.group({
        startCityInput: ['', required()],

        startCity: ['', required()],
        startCityLongitude: [0, required()],
        startCityLatitude: [0, required()],

        endCityInput: ['', required()],

        endCity: ['', required()],
        endCityLongitude: [0, required()],
        endCityLatitude: [0, required()],

        date: [''],
    });

    filteredStartCities?: Observable<StationList>;
    filteredEndCities?: Observable<StationList>;

    constructor(
        private readonly fb: FormBuilder,
        private readonly store: Store,
    ) {}

    ngOnInit(): void {
        this.filteredStartCities = this.searchForm.get('startCityInput')?.valueChanges.pipe(
            startWith(''),
            map((value: string | null) => this.filter(value || '', this.stationList() || [])),
        );

        this.filteredEndCities = this.searchForm.get('endCityInput')?.valueChanges.pipe(
            startWith(''),
            map((value: string | null) => this.filter(value || '', this.stationList() || [])),
        );
    }

    private filter(value: string, cities: StationList): StationList {
        const filterValue = value.toLowerCase();

        return cities.filter(city => city.city.toLowerCase().includes(filterValue));
    }

    onSubmit(): void {
        if (this.searchForm.valid) {
            this.store.dispatch(
                SearchActions.searchAll({
                    fromLatitude: this.searchForm.get('startCityLatitude')?.value || 0,
                    fromLongitude: this.searchForm.get('startCityLongitude')?.value || 0,
                    toLatitude: this.searchForm.get('endCityLatitude')?.value || 0,
                    toLongitude: this.searchForm.get('endCityLongitude')?.value || 0,
                    time: new Date(this.searchForm.get('date')?.value || '').getTime(),
                }),
            );
        }
    }

    swapValues(): void {
        this.searchForm.patchValue({
            startCity: this.searchForm.get('endCity')?.value,
            startCityLatitude: this.searchForm.get('endCityLatitude')?.value,
            startCityLongitude: this.searchForm.get('endCityLongitude')?.value,
            endCity: this.searchForm.get('startCity')?.value,
            endCityLatitude: this.searchForm.get('startCityLatitude')?.value,
            endCityLongitude: this.searchForm.get('startCityLongitude')?.value,
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCitySelected(field: string, event: any): void {
        const selectedCity = event.option.value;

        this.searchForm.patchValue({
            [field]: selectedCity.city,
            [`${field}Latitude`]: selectedCity.latitude,
            [`${field}Longitude`]: selectedCity.longitude,
        });
    }
}
