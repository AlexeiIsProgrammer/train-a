import {
    APP_INITIALIZER,
    ApplicationConfig,
    isDevMode,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as storeEffects from '@store/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { setAccessTokenInterceptor } from '@core/interceptors/set-access-token/set-access-token.interceptor';
import { handleInvalidTokenInterceptor } from '@core/interceptors/handle-invalid-token/handle-invalid-token.interceptor';
import { setUserStatus } from '@core/initializations/set-user-status';
import { AuthService } from '@shared/service/auth/auth.service';
import { loadStations } from '@core/initializations/load-stations';
import { storeReducer } from './store/reducer';
import { routes } from './router/app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withComponentInputBinding()),
        provideAnimationsAsync(),
        provideHttpClient(
            withInterceptors([setAccessTokenInterceptor, handleInvalidTokenInterceptor]),
        ),
        provideStore(storeReducer),
        provideEffects(storeEffects),
        provideStoreDevtools({ logOnly: !isDevMode() }),
        {
            provide: APP_INITIALIZER,
            useFactory: setUserStatus,
            deps: [AuthService],
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: loadStations,
            deps: [Store],
            multi: true,
        },
    ],
};
