import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoTrainsFoundComponent } from './no-trains-found.component';

describe('NoTrainsFoundComponent', () => {
    let component: NoTrainsFoundComponent;
    let fixture: ComponentFixture<NoTrainsFoundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NoTrainsFoundComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NoTrainsFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
