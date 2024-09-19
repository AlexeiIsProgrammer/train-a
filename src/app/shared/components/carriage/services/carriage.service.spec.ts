import { TestBed } from '@angular/core/testing';
import { CarriageService } from './carriage.service';
import { Carriage } from '@interface/carriage.interface';
import { Seat } from '@interface/seat.interface';
import { SeatingRow } from '@type/seating-row.type';

describe('CarriageService', () => {
    let service: CarriageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CarriageService], // Добавлено: регистрация CarriageService в провайдерах
        });
        service = TestBed.inject(CarriageService);
    });

    it('should generate seating data correctly', () => {
        const carriage: Carriage = {
            code: 'A1',
            leftSeats: 2,
            rightSeats: 2,
            rows: 2,
            name: 'test',
        };

        const expectedSeatingData: SeatingRow[] = [
            [
                { seat_number: 0, isFree: 1 },
                { seat_number: 1, isFree: 1 },
                { seat_number: -1, isFree: '-' },
                { seat_number: 2, isFree: 1 },
                { seat_number: 3, isFree: 1 },
            ],
            [
                { seat_number: 4, isFree: 1 },
                { seat_number: 5, isFree: 1 },
                { seat_number: -1, isFree: '-' },
                { seat_number: 6, isFree: 1 },
                { seat_number: 7, isFree: 1 },
            ],
        ];

        const result = service.generateSeatingData(carriage);
        expect(result).toEqual(expectedSeatingData);
    });

    it('should rotate the seating matrix correctly', () => {
        const seatingMatrix: SeatingRow[] = [
            [
                { seat_number: 0, isFree: 1 },
                { seat_number: 2, isFree: 1 },
                { seat_number: -1, isFree: '-' },
            ],
            [
                { seat_number: 1, isFree: 1 },
                { seat_number: 3, isFree: 1 },
                { seat_number: -1, isFree: '-' },
            ],
        ];

        const expectedRotatedMatrix: Seat[][] = [
            [
                { seat_number: -1, isFree: '-' },
                { seat_number: -1, isFree: '-' },
            ],
            [
                { seat_number: 1, isFree: 1 },
                { seat_number: 3, isFree: 1 },
            ],
            [
                { seat_number: 0, isFree: 1 },
                { seat_number: 2, isFree: 1 },
            ],
        ];

        const result = service.rotateSeatingMatrix(seatingMatrix);
        expect(result).toEqual(expectedRotatedMatrix);
    });

    it('should count free seats correctly', () => {
        const rotatedMatrix: Seat[][] = [
            [
                { seat_number: 0, isFree: 1 },
                { seat_number: 1, isFree: 1 },
            ],
            [
                { seat_number: 2, isFree: 0 },
                { seat_number: 3, isFree: 1 },
            ],
        ];

        const result = service.countFreeSeats(rotatedMatrix);
        expect(result).toBe(3); // Ожидаем 3 свободных места
    });
});
