import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationListComponent } from './station-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

const station = {
    '1': {
        id: 1,
        city: 'city1',
        latitude: 55,
        longitude: 12,
        connectedTo: [
            {
                id: 2,
                distance: 791,
            },
        ],
    },
    '2': {
        id: 2,
        city: 'city2',
        latitude: 32,
        longitude: 13,
        connectedTo: [
            {
                id: 1,
                distance: 791,
            },
        ],
    },
};
describe('StationListComponent', () => {
    let component: StationListComponent;
    let fixture: ComponentFixture<StationListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StationListComponent, NoopAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(StationListComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('stationEntities', station);

        fixture.detectChanges();
    });

    test('should emit removeOne with station id ', () => {
        const btn = fixture.debugElement.query(By.css('[test-id="remove-btn"]'));
        expect(btn).toBeTruthy();

        const spy = jest.spyOn(component.removeOne, 'emit');

        btn.nativeElement.click();

        expect(spy).toHaveBeenCalledWith(station[1].id);
    });

    test('should contain city-name', () => {
        const cityName = fixture.debugElement.query(By.css('[test-id="city-name"]'))
            .nativeElement as HTMLElement;

        expect(cityName.textContent).toContain(station[1].city);
    });

    test('should contain connected city', () => {
        const cityName = fixture.debugElement.query(By.css('[test-id="connectedTo "]'))
            .nativeElement as HTMLElement;

        expect(cityName.textContent).toContain(station[2].city);
    });

    test('should contain coordinates', () => {
        const coordinates = fixture.debugElement.query(By.css('[test-id="coordinates"]'))
            .nativeElement as HTMLElement;

        expect(coordinates.textContent).toContain(`${station[1].latitude}`);
        expect(coordinates.textContent).toContain(`${station[1].longitude}`);
    });
});
