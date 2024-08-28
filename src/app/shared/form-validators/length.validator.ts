import { ValidatorFn } from '@angular/forms';

export const length = (type: 'min' | 'max', count: number, message?: string): ValidatorFn => {
    return ({ value }) => {
        const err = { length: message ?? true };
        let result = false;

        if (type === 'min') {
            result = value.length < count;
        }

        if (type === 'max') {
            result = value.length > count;
        }

        return result ? err : null;
    };
};
