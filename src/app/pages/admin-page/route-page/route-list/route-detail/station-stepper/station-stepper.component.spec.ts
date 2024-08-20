import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationStepperComponent } from './station-stepper.component';

describe('StationStepperComponent', () => {
    let component: StationStepperComponent;
    let fixture: ComponentFixture<StationStepperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StationStepperComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StationStepperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
