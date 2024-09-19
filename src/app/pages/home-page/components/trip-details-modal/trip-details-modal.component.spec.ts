import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripDetailsModalComponent } from './trip-details-modal.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { TimeArrivalPipe } from './pipe/time-arrival.pipe';
import { ToTimePipe } from './pipe/to-time.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Segment } from '@type/search.type';
import { Station } from '@interface/station.interface';
import { By } from '@angular/platform-browser';

describe('TripDetailsModalComponent', () => {
    let component: TripDetailsModalComponent;
    let fixture: ComponentFixture<TripDetailsModalComponent>;
    let dialogRefMock: any;

    beforeEach(async () => {
        dialogRefMock = {
            close: jest.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [MatIconModule, MatButtonModule, MatTableModule, TimeArrivalPipe, ToTimePipe],
            providers: [{ provide: MatDialogRef, useValue: dialogRefMock }],
            schemas: [NO_ERRORS_SCHEMA], // To avoid errors for unrecognized components/pipes
        }).compileComponents();

        fixture = TestBed.createComponent(TripDetailsModalComponent);
        component = fixture.componentInstance;
    });

    describe('Component creation and initialization', () => {
        it('should create the component', () => {
            expect(component).toBeTruthy();
        });

        it('should set the dataSource on initialization based on the path input', () => {
            const mockPath = [101, 102, 103];
            component.path = mockPath;

            component.ngOnInit();

            expect(component.dataSource).toEqual(mockPath);
        });

        it('should initialize dataSource as an empty array if path input is undefined', () => {
            component.path = undefined;

            component.ngOnInit();

            expect(component.dataSource).toEqual([]);
        });
    });

    describe('Dialog closing', () => {
        it('should close the dialog when close method is called', () => {
            component.close();
            expect(dialogRefMock.close).toHaveBeenCalled();
        });

        it('should close the dialog when close button is clicked', () => {
            fixture.detectChanges();
            const closeButton = fixture.debugElement.query(By.css('.close-button')).nativeElement;
            closeButton.click();

            expect(dialogRefMock.close).toHaveBeenCalled();
        });
    });

    describe('Rendering data', () => {
        it('should display the routeId in the template', () => {
            component.routeId = 123;
            fixture.detectChanges();

            const routeHeader = fixture.debugElement.nativeElement.querySelector('h3');
            expect(routeHeader.textContent).toContain('Route 123');
        });

        it('should correctly call getCity() for each row in the station column', () => {
            const mockStationList: Station[] = [
                { id: 101, city: 'New York', latitude: 1, longitude: 2, connectedTo: [] },
                { id: 102, city: 'Los Angeles', latitude: 1, longitude: 2, connectedTo: [] },
            ];
            component.stationList = mockStationList;
            component.path = [101, 102];
            component.segments = [];
            fixture.detectChanges();

            const stationCells = fixture.debugElement.queryAll(By.css('td[mat-cell]'));
            expect(stationCells[1].nativeElement.textContent.trim()).toEqual('New York');
            expect(stationCells[3].nativeElement.textContent.trim()).toEqual('Los Angeles');
        });

        it('should display empty string if stationList is not available in getCity()', () => {
            component.stationList = undefined;
            component.path = [101];
            component.segments = [];
            fixture.detectChanges();

            const stationCells = fixture.debugElement.queryAll(By.css('td[mat-cell]'));
            expect(stationCells[1].nativeElement.textContent.trim()).toEqual('');
        });
    });

    describe('Pipes usage', () => {
        it('should apply ToTimePipe correctly in the time column', () => {
            const mockSegments: Segment[] = [
                { time: ['10:00', '12:00'], price: { '101': 12 }, occupiedSeats: [] },
                { time: ['10:00', '12:00'], price: { '101': 12 }, occupiedSeats: [] },
            ];
            component.segments = mockSegments;
            component.path = [101, 102];
            fixture.detectChanges();

            const timeCells = fixture.debugElement.queryAll(By.css('td[mat-cell]'));
            expect(timeCells[0].nativeElement.textContent.trim()).toContain('10:00');
            expect(timeCells[2].nativeElement.textContent.trim()).toContain('12:00');
        });

        it('should apply TimeArrivalPipe correctly in the stop column', () => {
            const mockSegments: Segment[] = [
                { time: ['10:00', '12:00'], price: { '101': 12 }, occupiedSeats: [] },
                { time: ['10:00', '12:00'], price: { '101': 12 }, occupiedSeats: [] },
            ];
            component.segments = mockSegments;
            component.path = [101, 102];
            fixture.detectChanges();

            const stopCells = fixture.debugElement.queryAll(By.css('td[mat-cell]'));
            expect(stopCells[2].nativeElement.textContent.trim()).toContain('12:00');
        });
    });
});
