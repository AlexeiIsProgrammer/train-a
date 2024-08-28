import { HttpInterceptorFn } from '@angular/common/http';
import { accessTokenName, ADMIN_TOKEN_SHORT_NAME } from '@shared/service/auth/token-names.const';

export const setAccessTokenInterceptor: HttpInterceptorFn = (req, next) => {
    let token = localStorage.getItem(accessTokenName);

    if (token?.endsWith(ADMIN_TOKEN_SHORT_NAME)) {
        token = token.replace(ADMIN_TOKEN_SHORT_NAME, '');
    }

    const newRequest = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });

    return next(token ? newRequest : req);
};
