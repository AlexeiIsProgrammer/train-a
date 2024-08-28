import { AuthService } from '@shared/service/auth/auth.service';
import { accessTokenName, ADMIN_TOKEN_SHORT_NAME } from '@shared/service/auth/token-names.const';

export const setUserStatus = (authService: AuthService) => () => {
    const token = localStorage.getItem(accessTokenName);

    if (token?.endsWith(ADMIN_TOKEN_SHORT_NAME)) {
        authService.setUserStatus('admin');

        return;
    }

    if (token) {
        authService.setUserStatus('user');
    }
};
