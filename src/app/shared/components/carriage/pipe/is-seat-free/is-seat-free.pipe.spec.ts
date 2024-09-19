import { IsSeatFreePipe } from './is-seat-free.pipe';

describe('IsSeatFreePipe', () => {
    let pipe: IsSeatFreePipe;

    beforeEach(() => {
        pipe = new IsSeatFreePipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return true if seat is free', () => {
        const seatNum = 1;
        const occupiedSeats = [2, 3, 4];
        const result = pipe.transform(seatNum, occupiedSeats);
        expect(result).toBe(true);
    });

    it('should return false if seat is occupied', () => {
        const seatNum = 2;
        const occupiedSeats = [2, 3, 4];
        const result = pipe.transform(seatNum, occupiedSeats);
        expect(result).toBe(false);
    });

    it('should return true if no seats are occupied', () => {
        const seatNum = 1;
        const occupiedSeats: number[] = [];
        const result = pipe.transform(seatNum, occupiedSeats);
        expect(result).toBe(true);
    });

    it('should return false if all seats are occupied', () => {
        const seatNum = 5;
        const occupiedSeats = [1, 2, 3, 4, 5];
        const result = pipe.transform(seatNum, occupiedSeats);
        expect(result).toBe(false);
    });

    it('should handle non-existent seat numbers', () => {
        const seatNum = 10;
        const occupiedSeats = [1, 2, 3];
        const result = pipe.transform(seatNum, occupiedSeats);
        expect(result).toBe(true);
    });
});
