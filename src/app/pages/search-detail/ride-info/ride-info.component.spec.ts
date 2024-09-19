import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideInfoComponent } from './ride-info.component';
import { provideRouter } from '@angular/router';

describe('RideInfoComponent', () => {
    let component: RideInfoComponent;
    let fixture: ComponentFixture<RideInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RideInfoComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(RideInfoComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
