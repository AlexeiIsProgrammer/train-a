import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDetailComponent } from './route-detail.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Route } from '@interface/route.interface';
import { By } from '@angular/platform-browser';

describe('RouteDetailComponent', () => {
    let fixture: ComponentFixture<RouteDetailComponent>;
    let component: RouteDetailComponent;

    const route: Route = {
        id: 1,
        path: [1, 2],
        carriages: ['test'],
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouteDetailComponent, NoopAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(RouteDetailComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('route', route);

        fixture.detectChanges();
    });

    it('should emit route', () => {
        const spy = jest.spyOn(component.update, 'emit');

        component.updateRoute();

        expect(spy).toHaveBeenCalledWith(route);
    });

    test('should contain station-stepper', () => {
        const stationStepper = fixture.debugElement.query(By.css('app-station-stepper'));

        expect(stationStepper).toBeDefined();
    });

    test('should contain carriages-stepper', () => {
        const carriageStepper = fixture.debugElement.query(By.css('app-carriages-stepper'));

        expect(carriageStepper).toBeDefined();
    });
});
