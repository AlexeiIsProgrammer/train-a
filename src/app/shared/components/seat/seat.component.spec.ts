import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SeatComponent } from './seat.component';

describe('SeatComponent', () => {
    let component: SeatComponent;
    let fixture: ComponentFixture<SeatComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SeatComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SeatComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should use large seat class when isSmallModel is false', () => {
        component.isSmallModel = false;
        fixture.detectChanges();

        const seatButton = fixture.debugElement.query(By.css('button'));
        expect(seatButton.nativeElement.classList).toContain('large-seat');
    });
});
