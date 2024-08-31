import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsModalComponent } from './trip-details-modal.component';

describe('TripDetailsModalComponent', () => {
    let component: TripDetailsModalComponent;
    let fixture: ComponentFixture<TripDetailsModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TripDetailsModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TripDetailsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
