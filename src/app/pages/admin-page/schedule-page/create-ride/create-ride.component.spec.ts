import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRideComponent } from './create-ride.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('CreateRideComponent', () => {
    let component: CreateRideComponent;
    let fixture: ComponentFixture<CreateRideComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreateRideComponent],
            providers: [provideMockStore()],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateRideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
