import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultListItemComponent } from './result-list-item.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ToDatePipe } from '../../../shared/pipes/to-date/to-date.pipe';
import { ToTimePipe } from './pipe/to-time/to-time.pipe';
import { ToCarriagesPipe } from './pipe/to-carriages/to-carriages.pipe';
import { SearchedRoute } from '@interface/search.interface';
import { Station } from '@interface/station.interface';
import { Carriage } from '@interface/carriage.interface';

describe('ResultListItemComponent', () => {
    let component: ResultListItemComponent;
    let fixture: ComponentFixture<ResultListItemComponent>;
    let matDialogMock: any;
    let routerMock: any;

    const routeMock: SearchedRoute = {
        id: 1,
        path: [1, 2, 3, 4],
        schedule: [
            {
                rideId: 1,
                segments: [
                    {
                        occupiedSeats: [],
                        price: { carriage1: 14 },
                        time: ['2024-09-15T08:00:00Z', '2024-09-15T10:00:00Z'],
                    },
                    {
                        occupiedSeats: [],
                        price: { carriage1: 14 },
                        time: ['2024-09-15T10:15:00Z', '2024-09-15T12:00:00Z'],
                    },
                ],
            },
        ],
        carriages: [],
    };

    beforeEach(async () => {
        matDialogMock = {
            open: jest.fn().mockReturnValue({ componentInstance: {} }),
        };

        routerMock = {
            navigate: jest.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [
                ResultListItemComponent,
                MatButtonModule,
                MatIconModule,
                MatDividerModule,
                MatCardModule,
                ToDatePipe,
                ToTimePipe,
                ToCarriagesPipe,
            ],
            providers: [
                { provide: MatDialog, useValue: matDialogMock },
                { provide: Router, useValue: routerMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ResultListItemComponent);
        component = fixture.componentInstance;

        component.route = routeMock;
        component.from = {
            stationId: 1,
            city: 'City A',
            geolocation: { latitude: 123, longitude: 23 },
        };
        component.to = {
            stationId: 4,
            city: 'City D',
            geolocation: { latitude: 123, longitude: 23 },
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should calculate correct time left between two dates', () => {
        const start = '2024-09-15T08:00:00Z';
        const end = '2024-09-15T10:30:00Z';
        expect(component.timeLeft(start, end)).toBe('2h 30m');
    });

    it('should open TripDetailsModal when openDialog is called', () => {
        component.openDialog(routeMock.schedule[0].segments, routeMock.path, 1);
        expect(matDialogMock.open).toHaveBeenCalled();
    });

    it('should navigate to trip page when card is clicked', () => {
        const eventMock = new MouseEvent('click');
        component.onCardClick(eventMock, 1);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/trip', 1], {
            queryParams: { from: 1, to: 4 },
        });
    });

    it('should calculate current route correctly', () => {
        const segments = routeMock.schedule[0].segments;
        const result = component.currentRoute(segments);
        expect(result).toBe('City A -> City D');
    });

    it('should return "No current routes" when no current segment is found', () => {
        const result = component.currentRoute([]);
        expect(result).toBe('No current routes');
    });
});
