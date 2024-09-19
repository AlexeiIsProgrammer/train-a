import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationConnectorComponent } from './station-connector.component';
import { provideMockStore } from '@ngrx/store/testing';
import { ConnectStationService } from '../services/connect-station/connect-station.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('StationConnectorComponent', () => {
    let fixture: ComponentFixture<StationConnectorComponent>;
    let component: StationConnectorComponent;
    let submitBtn: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StationConnectorComponent, NoopAnimationsModule],
            providers: [provideMockStore(), ConnectStationService],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StationConnectorComponent);
        component = fixture.componentInstance;

        submitBtn = fixture.debugElement.query(By.css('[test-id="submit-btn"]'));

        fixture.detectChanges();
    });

    test('should provide valid city name', () => {
        const { city } = component.connectionForm.controls;

        city.setValue('');
        expect(city.errors).not.toBeNull();

        city.setValue('ci ty');
        expect(city.errors).not.toBeNull();

        city.setValue('city');
        expect(city.errors).toBeNull();
    });

    test('should provide valid latitude', () => {
        const { latitude } = component.connectionForm.controls;

        latitude.setValue(91);
        expect(latitude.errors).not.toBeNull();

        latitude.setValue(-91);
        expect(latitude.errors).not.toBeNull();

        latitude.setValue(50);
        expect(latitude.errors).toBeNull();
    });

    test('should provide valid longitude', () => {
        const { longitude } = component.connectionForm.controls;

        longitude.setValue(181);
        expect(longitude.errors).not.toBeNull();

        longitude.setValue(-181);
        expect(longitude.errors).not.toBeNull();

        longitude.setValue(90);
        expect(longitude.errors).toBeNull();
    });

    test('should provide at least one city', () => {
        const { connectedStationControl } = component;

        connectedStationControl.setValue([]);
        expect(connectedStationControl.errors).not.toBeNull();

        connectedStationControl.setValue([1, 2]);
        expect(connectedStationControl.errors).not.toBeNull();

        connectedStationControl.setValue([1, 2, 3]);
        expect(connectedStationControl.errors).toBeNull();
    });

    test('should  disable btn when form invalid', () => {
        const { connectionForm } = component;

        expect(connectionForm.invalid).toBeTruthy();
        expect(submitBtn.attributes['disabled']).toBeTruthy();
    });

    test('should call submit fn btn when form valid', () => {
        const { connectionForm, connectedStationControl } = component;
        const submitSpy = jest.spyOn(component, 'submit');

        expect(connectionForm.invalid).toBeTruthy();
        expect(connectedStationControl.invalid).toBeTruthy();

        connectedStationControl.setValue([1, 2, 3]);
        connectionForm.setValue({
            city: 'city',
            latitude: 50,
            longitude: 50,
        });

        fixture.detectChanges();

        expect(submitBtn.attributes['disabled']).toBeUndefined();

        submitBtn.triggerEventHandler('click');

        expect(submitSpy).toHaveBeenCalledTimes(1);
    });

    test('should show err message when try to add exists station name', () => {
        const { city } = component.connectionForm.controls;

        fixture.componentRef.setInput('stationList', [{ city: 'test' }]);
        city.setValue('test');

        expect(city.errors).toBeNull();
        component.addStation();
        expect(city.errors).not.toBeNull();
    });

    test('should emit station when to call addStation', () => {
        const { city } = component.connectionForm.controls;
        const createOneSpy = jest.spyOn(component.createOne, 'emit');

        fixture.componentRef.setInput('stationList', [{ city: 'test' }]);
        city.setValue('city');

        component.addStation();

        expect(createOneSpy).toHaveBeenCalledTimes(1);
    });
});
