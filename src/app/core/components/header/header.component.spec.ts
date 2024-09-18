import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../shared/service/auth/auth.service';
import { of, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let authServiceMock: any;
    let routerMock: any;
    let eventsSubject: Subject<any>;

    beforeEach(async () => {
        authServiceMock = {
            userType$: of('guest'),
            logout: jest.fn().mockReturnValue(of(true)),
        };

        eventsSubject = new Subject();

        routerMock = {
            events: eventsSubject.asObservable(),
            navigate: jest.fn(),
        };

        await TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterTestingModule],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call logout method when logout button is clicked', () => {
        const logoutSpy = jest.spyOn(component, 'logout');
        const button = fixture.debugElement.nativeElement.querySelector('button[mat-icon-button]');
        button.click();
        expect(logoutSpy).toHaveBeenCalled();
        expect(authServiceMock.logout).toHaveBeenCalled();
    });

    it('should update isAdminPage when navigation to admin page occurs', () => {
        eventsSubject.next(new NavigationEnd(0, '/admin', '/admin'));
        expect(component.isAdminPage).toBe(true);
    });

    it('should display appropriate links for guest user', () => {
        authServiceMock.userType$ = of('guest');
        fixture.detectChanges();

        const signinLink =
            fixture.debugElement.nativeElement.querySelector('a[routerLink="/signin"]');
        const signupLink =
            fixture.debugElement.nativeElement.querySelector('a[routerLink="/signup"]');

        expect(signinLink).toBeTruthy();
        expect(signupLink).toBeTruthy();
    });

    it('should display appropriate links for admin user', () => {
        authServiceMock.userType$ = of('admin');
        eventsSubject.next(new NavigationEnd(0, '/admin', '/admin'));
        fixture.detectChanges();

        const adminLink =
            fixture.debugElement.nativeElement.querySelector('a[routerLink="/admin"]');
        const stationsLink = fixture.debugElement.nativeElement.querySelector(
            'a[routerLink="/admin/stations"]',
        );

        expect(adminLink).toBeTruthy();
        expect(stationsLink).toBeTruthy();
    });
});
