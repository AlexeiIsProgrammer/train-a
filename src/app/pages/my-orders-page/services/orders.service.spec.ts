import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrdersService } from './orders.service';
import { Order } from '@interface/order.interface';
import { OrderList, UserList } from '@type/order.type';
import { Carriages } from '@type/carriages.type';

describe('OrdersService', () => {
    let service: OrdersService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [OrdersService],
        });
        service = TestBed.inject(OrdersService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch orders', () => {
        const mockOrders: OrderList = [
            {
                id: 1,
                rideId: 1,
                seatId: 1,
                carriages: ['A'],
                path: [1, 2],
                schedule: { segments: [] },
                routeId: 0,
                userId: 0,
                status: '',
                stationEnd: 0,
                stationStart: 0,
            },
        ];

        service.fetchOrders(true).subscribe(orders => {
            expect(orders).toEqual(mockOrders);
        });

        const req = httpMock.expectOne('/api/order?all=true');
        expect(req.request.method).toBe('GET');
        req.flush(mockOrders);
    });

    it('should fetch users', () => {
        const mockUsers: UserList = [
            {
                id: 1,
                name: 'John Doe',
                email: '',
                role: 'user',
            },
        ];

        service.fetchUsers().subscribe(users => {
            expect(users).toEqual(mockUsers);
        });

        const req = httpMock.expectOne('/api/users');
        expect(req.request.method).toBe('GET');
        req.flush(mockUsers);
    });

    it('should cancel an order', () => {
        const mockOrderId = 1;
        service.cancelOrder(mockOrderId).subscribe(order => {
            expect(order).toBeUndefined();
        });

        const req = httpMock.expectOne(`/api/order/${mockOrderId}`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });

    it('should create an order', () => {
        const orderData = { rideId: 1, seat: 2, stationStart: 1, stationEnd: 2 };
        const mockOrder: Order = {
            id: 1,
            rideId: 1,
            seatId: 2,
            carriages: ['A'],
            path: [1, 2],
            schedule: { segments: [] },
            routeId: 0,
            userId: 0,
            status: '',
            stationEnd: 0,
            stationStart: 0,
        };

        service
            .createOrder(
                orderData.rideId,
                orderData.seat,
                orderData.stationStart,
                orderData.stationEnd,
            )
            .subscribe(order => {
                expect(order).toEqual(mockOrder);
            });

        const req = httpMock.expectOne('/api/order');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(orderData);
        req.flush(mockOrder);
    });

    it('should correctly create carriage map', () => {
        const mockCarriages: Carriages = [
            {
                name: 'A',
                leftSeats: 10,
                rightSeats: 10,
                rows: 5,
                code: '',
            },
            {
                name: 'B',
                leftSeats: 8,
                rightSeats: 8,
                rows: 4,
                code: '',
            },
        ];

        const result = service.createCarriageMap(mockCarriages);
        expect(result).toEqual({
            A: 100,
            B: 64,
        });
    });

    it('should calculate total price correctly', () => {
        const mockOrder: Order = {
            id: 1,
            rideId: 1,
            seatId: 1,
            carriages: ['A'],
            path: [1, 2],
            schedule: {
                segments: [
                    {
                        price: { standard: 20, first: 35 },
                        time: ['2023-01-01T10:00:00Z', '2023-01-01T12:00:00Z'],
                    },
                    {
                        price: { standard: 25, first: 40 },
                        time: ['2023-01-01T13:00:00Z', '2023-01-01T14:00:00Z'],
                    },
                ],
            },
            routeId: 0,
            userId: 0,
            status: '',
            stationEnd: 0,
            stationStart: 0,
        };

        expect(service.calculateTotalPrice(mockOrder, 1, 2, 'standard')).toBe(20);
    });

    it('should calculate trip duration correctly', () => {
        const mockOrder: Order = {
            id: 1,
            rideId: 1,
            seatId: 1,
            carriages: ['A'],
            path: [1, 2, 3],
            schedule: {
                segments: [
                    {
                        price: { standard: 20, first: 35 },
                        time: ['2023-01-01T10:00:00Z', '2023-01-01T12:00:00Z'],
                    },
                    {
                        price: { standard: 25, first: 40 },
                        time: ['2023-01-01T13:00:00Z', '2023-01-01T14:00:00Z'],
                    },
                ],
            },
            routeId: 0,
            userId: 0,
            status: '',
            stationEnd: 0,
            stationStart: 0,
        };

        expect(service.calculateTripDuration(mockOrder, 1, 3)).toBe('4h 0m');
    });

    it('should get date correctly', () => {
        const mockOrder: Order = {
            id: 1,
            rideId: 1,
            seatId: 1,
            carriages: ['A'],
            path: [1, 2],
            schedule: {
                segments: [
                    {
                        time: ['2023-01-01T10:00:00Z', '2023-01-01T12:00:00Z'],
                        price: {},
                    },
                ],
            },
            routeId: 0,
            userId: 0,
            status: '',
            stationEnd: 0,
            stationStart: 0,
        };

        expect(service.getDate(mockOrder, 1, 'start')).toBe('January 1, 13:00');
        expect(service.getDate(mockOrder, 2, 'end')).toBe('January 1, 15:00');
    });
});
