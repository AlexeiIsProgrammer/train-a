import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarriagesStepperComponent } from './carriages-stepper.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('CarriagesStepperComponent', () => {
    let component: CarriagesStepperComponent;
    let fixture: ComponentFixture<CarriagesStepperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CarriagesStepperComponent, NoopAnimationsModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CarriagesStepperComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should refresh carriagesForm when pathIds changed', () => {
        const { carriagesForm } = component;
        expect(carriagesForm).toHaveLength(0);

        fixture.componentRef.setInput('carriages', ['t1', 't2']);
        fixture.detectChanges();
        expect(carriagesForm).toHaveLength(2);
    });

    test('should add control', () => {
        const { carriagesForm } = component;

        expect(carriagesForm).toHaveLength(0);
        component.addOne(0, 'test1');
        component.addOne(1, 'test2');
        expect(carriagesForm).toHaveLength(2);

        component.addOne(0, 'test3');
        expect(carriagesForm.controls.at(1)?.value).toBe('test3');

        component.addOne(2, 'test4');
        expect(carriagesForm.controls.at(3)?.value).toBe('test4');
    });

    test('should edit control', () => {
        const { carriagesForm } = component;

        expect(carriagesForm).toHaveLength(0);
        component.addOne(0, 'test');
        expect(carriagesForm.controls.at(0)?.value).toBe('test');

        component.editOne(0, 'test123');
        expect(carriagesForm.controls.at(0)?.value).toBe('test123');
    });

    test('should remove control', () => {
        const { carriagesForm } = component;

        component.addOne(0, 'test1');
        component.addOne(0, 'test2');
        component.addOne(0, 'test3');

        expect(carriagesForm).toHaveLength(3);

        component.removeOne(1);

        expect(carriagesForm).toHaveLength(2);
        expect(carriagesForm.controls.at(1)?.value).toBe('test2');

        component.removeOne(0);
        component.removeOne(0);
        component.removeOne(0);
        expect(carriagesForm).toHaveLength(0);
    });

    test('should disabled Remove btn if types count <= 3', () => {
        fixture.componentRef.setInput('carriages', ['test', 'test', 'test']);
        fixture.detectChanges();

        let btn = fixture.debugElement.query(By.css('[test-id="remove-btn"]'));
        expect(btn['attributes']['disabled']).toBeTruthy();
    });

    test('should enabled Remove btn if types count > 3', () => {
        fixture.componentRef.setInput('carriages', ['test', 'test', 'test', 'test', 'test']);
        fixture.detectChanges();

        let btn = fixture.debugElement.query(By.css('[test-id="remove-btn"]'));
        expect(btn['attributes']['disabled']).toBeUndefined();
    });
});
