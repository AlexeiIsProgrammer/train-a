import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderConfirmDeleteComponent } from './order-confirm-delete.component';

describe('OrderConfirmDeleteComponent', () => {
    let component: OrderConfirmDeleteComponent;
    let fixture: ComponentFixture<OrderConfirmDeleteComponent>;

    const mockDialogRef = {
        close: jest.fn(),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrderConfirmDeleteComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: { orderId: 1, customerName: 'John Doe' } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(OrderConfirmDeleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the correct orderId and customerName', () => {
        const dialogContent = fixture.nativeElement.querySelector('mat-dialog-content p');
        expect(dialogContent.textContent).toContain('Do you want remove order#1 by John Doe?');
    });
});
