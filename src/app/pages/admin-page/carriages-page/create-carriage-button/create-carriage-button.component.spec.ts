import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCarriageButtonComponent } from './create-carriage-button.component';

describe('CreateCarriageButtonComponent', () => {
    let component: CreateCarriageButtonComponent;
    let fixture: ComponentFixture<CreateCarriageButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreateCarriageButtonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateCarriageButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
