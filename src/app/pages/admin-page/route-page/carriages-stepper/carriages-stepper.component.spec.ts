import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarriagesStepperComponent } from './carriages-stepper.component';

describe('CarriagesStepperComponent', () => {
    let component: CarriagesStepperComponent;
    let fixture: ComponentFixture<CarriagesStepperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CarriagesStepperComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CarriagesStepperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
