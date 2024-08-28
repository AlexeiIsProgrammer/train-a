import { AbstractControl, ValidatorFn } from '@angular/forms';

export const isEmail: ValidatorFn = ({ value }: AbstractControl) => {
    return value.match(/^[\w\d_]+@[\w\d_]+.\w{2,7}$/) ? null : { isEmail: 'Incorrect email' };
};
