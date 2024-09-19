import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarriageComponent } from './carriage.component';
import { CarriageService } from './services/carriage.service';
import { of } from 'rxjs';

class MockCarriageService {
    generateSeatingData() {
        return [
            { seat_number: 1, isFree: 1 },
            { seat_number: 2, isFree: 0 },
        ];
    }
    rotateSeatingMatrix(seatingData: any) {
        return [seatingData];
    }
}

describe('CarriageComponent', () => {
    let component: CarriageComponent;
    let fixture: ComponentFixture<CarriageComponent>;
    let carriageService: CarriageService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CarriageComponent],
            providers: [{ provide: CarriageService, useClass: MockCarriageService }],
        }).compileComponents();

        fixture = TestBed.createComponent(CarriageComponent);
        component = fixture.componentInstance;
        carriageService = TestBed.inject(CarriageService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(component.carriage).toBeNull();
        expect(component.isSmallModel).toBeNull();
        expect(component.selectedSeat).toBeNull();
        expect(component.occupiedSeats).toEqual([]);
        expect(component.carNum).toBeNull();
        expect(component.firstSeatNum).toBe(1);
    });

    it('should update seating matrix on ngOnInit', () => {
        component.carriage = {
            code: 'A1',
            leftSeats: 10,
            name: 'Test Car',
            rightSeats: 10,
            rows: 5,
        };
        component.ngOnInit();
        expect(component.rotatedSeatingMatrices.length).toBeGreaterThan(0);
    });

    it('should count free seats correctly', () => {
        component.rotatedSeatingMatrices = [
            [
                { seat_number: 1, isFree: 1 },
                { seat_number: 2, isFree: 0 },
                { seat_number: 3, isFree: 1 },
            ],
        ];
        component.firstSeatNum = 1;
        component.occupiedSeats = [2];

        const freeSeatsCount = component.countFreeSeats();
        expect(freeSeatsCount).toBe(1);
    });

    it('should update seating matrix on changes', () => {
        component.updateSeatingMatrix = jest.fn();

        component.carriage = {
            code: 'A1',
            leftSeats: 10,
            name: 'Test Car',
            rightSeats: 10,
            rows: 5,
        };

        component.ngOnChanges({
            carriage: {
                currentValue: component.carriage,
                previousValue: undefined,
                firstChange: false,
                isFirstChange: () => false,
            },
        });

        expect(component.updateSeatingMatrix).toHaveBeenCalled();
    });

    it('should do nothing if carriage is null', () => {
        component.carriage = null;
        component.updateSeatingMatrix();
        expect(component.rotatedSeatingMatrices).toEqual([]);
    });
});
