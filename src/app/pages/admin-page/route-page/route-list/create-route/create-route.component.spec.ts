import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { CreateRouteComponent } from './create-route.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatDialogClose } from '@angular/material/dialog';

describe('CreateRouteComponent', () => {
    let component: CreateRouteComponent;
    let fixture: ComponentFixture<CreateRouteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreateRouteComponent, NoopAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateRouteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should save actual value', fakeAsync(() => {
        const btn = fixture.debugElement.query(By.css('[test-id="save-btn"]'));
        const matDialogClose = btn.injector.get(MatDialogClose);

        component.carriagesStepper?.addOne(0, 'test');
        component.stationStepper?.addOne(0, 1);

        fixture.detectChanges();

        expect(matDialogClose.dialogResult).toEqual({ carriages: ['test'], path: [1] });
    }));
});
