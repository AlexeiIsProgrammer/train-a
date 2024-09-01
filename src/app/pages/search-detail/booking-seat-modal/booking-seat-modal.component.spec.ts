import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSeatModalComponent } from './booking-seat-modal.component';

describe('BookingSeatModalComponent', () => {
    let component: BookingSeatModalComponent;
    let fixture: ComponentFixture<BookingSeatModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BookingSeatModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BookingSeatModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
