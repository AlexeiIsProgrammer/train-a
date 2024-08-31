import { Injectable } from '@angular/core';
import { Carriage } from '@interface/carriage.interface';
import { Seat } from '@interface/seat.interface';
import { SeatingRow } from '@type/seating-row.type';

@Injectable()
export class CarriageService {
    generateSeatingData(carriage: Carriage): SeatingRow[] {
        const seatingData: SeatingRow[] = [];
        let seatCounter = 0;

        for (let i = 0; i < carriage.rows; i += 1) {
            const row: Seat[] = [];

            for (let j = 0; j < carriage.leftSeats; j += 1) {
                row.push({
                    seat_number: seatCounter,
                    isFree: 1,
                });
                seatCounter += 1;
            }

            row.push({
                seat_number: -1,
                isFree: '-',
            });

            for (let j = 0; j < carriage.rightSeats; j += 1) {
                row.push({
                    seat_number: seatCounter,
                    isFree: 1,
                });
                seatCounter += 1;
            }

            seatingData.push(row);
        }

        return seatingData;
    }

    rotateSeatingMatrix(matrix: SeatingRow[]): Seat[][] {
        const numRows = matrix.length;
        const numCols = matrix[0].length;
        const rotatedMatrix: Seat[][] = Array.from({ length: numCols }, () => []);
        let seatCount = 0;

        for (let i = 0; i < numRows; i += 1) {
            for (let j = 0; j < numCols; j += 1) {
                const isFree = matrix[i][j].isFree;

                if (isFree !== '-') {
                    const originalIndex = seatCount;

                    rotatedMatrix[numCols - 1 - j][i] = {
                        seat_number: originalIndex,
                        isFree,
                    };
                    seatCount += 1;
                } else {
                    rotatedMatrix[numCols - 1 - j][i] = {
                        seat_number: -1,
                        isFree,
                    };
                }
            }
        }

        return rotatedMatrix;
    }

    countFreeSeats(rotatedMatrix: Seat[][]): number {
        return rotatedMatrix.flat().filter(seat => seat.isFree === 1).length;
    }
}
