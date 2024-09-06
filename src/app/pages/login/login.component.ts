import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-login',
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
        NgIf,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
    isPasswordHide = true;
    isFormInitial = true;
    loading = false;

    readonly loginForm = this.formBuilder.nonNullable.group({
        email: ['', this.getEmailValidators()],
        password: ['', this.getPasswordValidators()],
    });

    readonly confirmPassword = this.formBuilder.nonNullable.control('');

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
    ) {}

    private getEmailValidators() {
        return this.isFormInitial ? [] : [required(), hasGaps, isEmail];
    }

    private getPasswordValidators() {
        return this.isFormInitial
            ? []
            : [
                  required(),
                  hasGaps,
                  length('min', 8, 'Password must be at least 8 characters long'),
              ];
    }

    login(): void {
        this.isFormInitial = false;

        this.loginForm.controls.email.setValidators(this.getEmailValidators());
        this.loginForm.controls.password.setValidators(this.getPasswordValidators());
        this.loginForm.updateValueAndValidity();

        if (this.loginForm.valid) {
            this.loading = true;
            const formValue = this.loginForm.getRawValue();

            this.authService.logIn(formValue).subscribe({
                next: () => {
                    this.loading = false;
                },
                error: (err: unknown) => {
                    this.loading = false;

                    if (!(err instanceof HttpErrorResponse)) {
                        return;
                    }

                    const message = 'Incorrect email or password';

                    this.handleErr(message);
                },
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    private handleErr(message?: string): void {
        const { email, password } = this.loginForm.controls;
        const controlErr = { error: message };

        email.setValue('');
        email.setErrors(controlErr);

        password.setValue('');
        password.setErrors(controlErr);
    }
}
