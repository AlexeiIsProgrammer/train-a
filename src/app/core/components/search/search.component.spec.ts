import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SearchActions } from '../../../store/search/search.actions';
import { of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { Station } from '@interface/station.interface';
import { signal } from '@angular/core';

describe('SearchComponent', () => {
    let component: SearchComponent;
    let fixture: ComponentFixture<SearchComponent>;
    let storeMock: any;

    const stationListMock: Station[] = [
        { id: 1, city: 'New York', latitude: 40.7128, longitude: -74.006, connectedTo: [] },
        { id: 2, city: 'Los Angeles', latitude: 34.0522, longitude: -118.2437, connectedTo: [] },
    ];

    beforeEach(async () => {
        storeMock = {
            select: jest.fn().mockReturnValue(of(null)),
            dispatch: jest.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [
                SearchComponent,
                ReactiveFormsModule,
                MatButtonModule,
                MatFormFieldModule,
                MatInputModule,
                MatAutocompleteModule,
                MatDatepickerModule,
                MatIconModule,
            ],
            providers: [{ provide: Store, useValue: storeMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchComponent);
        component = fixture.componentInstance;

        // component.stationList = signal(() => stationListMock);
        // component.search = signal(() => ({
        //     startCity: stationListMock[0],
        //     endCity: stationListMock[1],
        //     date: '2024-09-18',
        //     time: '10:00',
        // }));

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with empty values if no signal value is provided', () => {
        expect(component.searchForm.value).toEqual({
            startCity: '',
            endCity: '',
            date: '',
            time: '',
        });
    });

    it('should update form with search data from signal on init', () => {
        component.ngOnInit();

        expect(component.searchForm.value).toEqual({
            startCity: stationListMock[0],
            endCity: stationListMock[1],
            date: '2024-09-18',
            time: '10:00',
        });
    });

    it('should call store dispatch with correct actions when form is submitted', () => {
        component.searchForm.patchValue({
            startCity: stationListMock[0],
            endCity: stationListMock[1],
            date: '2024-09-18',
            time: '10:00',
        });

        component.onSubmit();

        expect(storeMock.dispatch).toHaveBeenCalledWith(
            SearchActions.setSearch({
                startCity: stationListMock[0],
                endCity: stationListMock[1],
                date: '2024-09-18',
                time: '10:00',
            }),
        );

        expect(storeMock.dispatch).toHaveBeenCalledWith(
            SearchActions.loadAll({
                fromLatitude: stationListMock[0].latitude,
                fromLongitude: stationListMock[0].longitude,
                toLatitude: stationListMock[1].latitude,
                toLongitude: stationListMock[1].longitude,
                time: new Date('2024-09-18T10:00:00').getTime(),
            }),
        );
    });

    it('should swap values of startCity and endCity when swapValues is called', () => {
        component.searchForm.patchValue({
            startCity: stationListMock[0],
            endCity: stationListMock[1],
        });

        component.swapValues();

        expect(component.searchForm.value).toEqual({
            startCity: stationListMock[1],
            endCity: stationListMock[0],
            date: '',
            time: '',
        });
    });

    it('should return city name in displayFn', () => {
        const city = component.displayFn(stationListMock[0]);
        expect(city).toBe('New York');
    });

    it('should return empty string in displayFn if option is not defined', () => {
        const city = component.displayFn(null as any);
        expect(city).toBe('');
    });

    it('should validate if value is of type Station in isCityStation', () => {
        const isStation = component.isCityStation(stationListMock[0]);
        expect(isStation).toBe(true);

        const isNotStation = component.isCityStation('Not a Station');
        expect(isNotStation).toBe(false);
    });
});
