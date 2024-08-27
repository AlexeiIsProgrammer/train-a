import { ValidatorFn } from '@angular/forms';

export const futureDateValidator: ValidatorFn = ({ value }) => {
    const currentDate = new Date();
    const selectedDate = new Date(value);

    return selectedDate <= currentDate ? { futureDate: 'Should be in future' } : null;
};
