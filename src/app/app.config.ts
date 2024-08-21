import {
    APP_INITIALIZER,
    ApplicationConfig,
    isDevMode,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as storeEffects from '@store/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { EMPTY, iif, tap } from 'rxjs';
import { serialize, parse } from 'cookie';
import { routes } from './app.routes';
import { storeReducer } from './store/reducer';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(
            withInterceptors([
                //! temporarily until creating login page
                (req, next) => {
                    const token = parse(document.cookie)['token'];

                    return token
                        ? next(
                              req.clone({
                                  setHeaders: {
                                      Authorization: `Bearer ${token}`,
                                  },
                              }),
                          )
                        : next(req);
                },
            ]),
        ),
        provideStore(storeReducer),
        provideEffects(storeEffects),
        provideStoreDevtools({ logOnly: !isDevMode() }),
        {
            //! temporarily until creating login page
            provide: APP_INITIALIZER,
            useFactory: (httpClient: HttpClient) => () => {
                return iif(
                    () => !!parse(document.cookie)['token'],
                    EMPTY,
                    httpClient
                        .post<{ token: string }>('/api/signin', {
                            email: 'admin@admin.com',
                            password: 'my-password',
                        })
                        .pipe(
                            tap(({ token }) => {
                                document.cookie = serialize('token', token);
                            }),
                        ),
                );
            },
            deps: [HttpClient],
            multi: true,
        },
    ],
};
