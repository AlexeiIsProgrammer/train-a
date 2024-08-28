import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { hasGaps } from '@shared/form-validators/has-gaps.validator';
import { isEmail } from '@shared/form-validators/email.validator';
import { required } from '@shared/form-validators/required.validator';
import { GetControlErrorMessagePipe } from '@shared/pipes/get-control-error-message/get-control-error-message.pipe';
import { length } from '@shared/form-validators/length.validator';
import { AuthService } from '@shared/service/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-sing-up',
    standalone: true,
    imports: [
        MatCardModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIcon,
        MatInputModule,
        MatButtonModule,
        RouterLink,
        GetControlErrorMessagePipe,
    ],
    templateUrl: './sing-up.component.html',
    styleUrl: './sing-up.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingUpComponent implements OnInit {
    isPasswordHide = true;

    readonly singUpForm = this.formBuilder.nonNullable.group({
        email: ['', [required(), hasGaps, isEmail]],
        password: '',
    });

    readonly confirmPassword = this.formBuilder.nonNullable.control('');

    private readonly passwordValidators: ValidatorFn[] = [
        required(),
        hasGaps,
        length('min', 8, 'Password must be at least 8 characters long'),
        control => {
            const { password } = this.singUpForm.controls;
            const err = { confirmPassword: 'Passwords do not match' };

            const isPasswordsMatch = password.value === this.confirmPassword.value;

            if (control === password) {
                if (isPasswordsMatch) {
                    this.confirmPassword.setErrors(null);
                } else {
                    this.confirmPassword.setErrors(err);
                }

                return null;
            }

            return isPasswordsMatch ? null : err;
        },
    ];

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
    ) {}

    ngOnInit(): void {
        const { password } = this.singUpForm.controls;

        password.setValidators(this.passwordValidators);
        this.confirmPassword.setValidators(this.passwordValidators);
    }

    singUp(): void {
        const formValue = this.singUpForm.getRawValue();

        this.authService.singUp(formValue).subscribe({
            error: (err: unknown) => {
                if (!(err instanceof HttpErrorResponse)) {
                    return;
                }

                const message = err.error.message;

                this.handleErr(message);
            },
        });
    }

    private handleErr(message?: string): void {
        const { email, password } = this.singUpForm.controls;
        const controlErr = { error: message };

        if (message?.match(/([Ee]mail|[Uu]ser)/)) {
            email.setValue('');
            email.setErrors(controlErr);

            return;
        }

        if (message?.match(/([pP]assword)/)) {
            password.setValue('');
            password.setErrors(controlErr);
        }
    }
}
