import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { SearchComponent } from '@core/components/search/search.component';
import { NoTrainsFoundComponent } from './components/no-trains-found/no-trains-found.component';
import { ResultListItemComponent } from '@core/components/result-list-item/result-list-item.component';
import { ToDatePipe } from '@shared/pipes/to-date/to-date.pipe';
import { DateFilterPipe } from './pipe/date-filter/date-filter.pipe';
import { ToDateTabsPipe } from './pipe/to-date-tabs/to-date-tabs.pipe';
import { GetDayPipe } from './pipe/get-day/get-day.pipe';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';

describe('HomePageComponent', () => {
    let component: HomePageComponent;
    let fixture: ComponentFixture<HomePageComponent>;
    let storeMock: any;

    beforeEach(async () => {
        storeMock = {
            select: jest.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [
                HomePageComponent,
                MatListModule,
                MatTabsModule,
                SearchComponent,
                NoTrainsFoundComponent,
                ResultListItemComponent,
                CommonModule,
                ToDatePipe,
                DateFilterPipe,
                ToDateTabsPipe,
                GetDayPipe,
            ],
            providers: [{ provide: Store, useValue: storeMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(HomePageComponent);
        component = fixture.componentInstance;

        // Mocking signals for stations, searchStations, and carriages
        component.stations = signal(() => [
            { id: 1, city: 'New York' },
            { id: 2, city: 'Los Angeles' },
        ]);

        component.searchStations = signal(() => ({
            routes: [
                {
                    id: 1,
                    from: { stationId: 1, name: 'New York' },
                    to: { stationId: 2, name: 'Los Angeles' },
                    date: '2024-09-20',
                },
            ],
            from: { stationId: 1, name: 'New York' },
            to: { stationId: 2, name: 'Los Angeles' },
        }));

        component.carriages = signal(() => [
            { id: 1, name: 'Carriage 1' },
            { id: 2, name: 'Carriage 2' },
        ]);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render search component with stations list', () => {
        const searchComponent = fixture.nativeElement.querySelector('app-search');
        expect(searchComponent).toBeTruthy();
        expect(searchComponent.getAttribute('ng-reflect-station-list')).toContain('New York');
    });

    it('should render tab group with routes if searchStations has routes', () => {
        const tabGroup = fixture.nativeElement.querySelector('mat-tab-group');
        expect(tabGroup).toBeTruthy();

        const tabs = tabGroup.querySelectorAll('mat-tab');
        expect(tabs.length).toBe(1); // One route is defined in the mock

        const dateElement = tabs[0].querySelector('.date');
        const dayElement = tabs[0].querySelector('.day');
        expect(dateElement.textContent).toContain('2024-09-20'); // Date rendered through toDatePipe
        expect(dayElement.textContent).toBeTruthy(); // Day rendered through getDayPipe
    });

    it('should render result list items for each route', () => {
        const resultListItem = fixture.nativeElement.querySelector('app-result-list-item');
        expect(resultListItem).toBeTruthy();

        expect(resultListItem.getAttribute('ng-reflect-route')).toContain('New York');
        expect(resultListItem.getAttribute('ng-reflect-carriage-list')).toContain('Carriage 1');
    });

    it('should show "no trains found" component if no routes available', () => {
        // Mocking empty routes
        component.searchStations = signal(() => ({ routes: [], from: null, to: null }));
        fixture.detectChanges();

        const noTrainsFound = fixture.nativeElement.querySelector('app-no-trains-found');
        expect(noTrainsFound).toBeTruthy();
    });

    it('should not render tab group if searchStations is null or has no routes', () => {
        // Mocking no data from searchStations
        component.searchStations = signal(() => ({ routes: [], from: null, to: null }));
        fixture.detectChanges();

        const tabGroup = fixture.nativeElement.querySelector('mat-tab-group');
        expect(tabGroup).toBeFalsy();

        const noTrainsFound = fixture.nativeElement.querySelector('app-no-trains-found');
        expect(noTrainsFound).toBeTruthy();
    });
});
