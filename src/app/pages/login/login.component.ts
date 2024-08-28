import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
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
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
    isPasswordHide = true;

    readonly loginForm = this.formBuilder.nonNullable.group({
        email: ['', [required(), hasGaps, isEmail]],
        password: [
            '',
            [required(), hasGaps, length('min', 8, 'Password must be at least 8 characters long')],
        ],
    });

    readonly confirmPassword = this.formBuilder.nonNullable.control('');

    constructor(
        private readonly router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
    ) {}

    login(): void {
        const formValue = this.loginForm.getRawValue();

        this.authService.logIn(formValue).subscribe({
            next: () => {
                this.router.navigateByUrl('');
            },
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
        const { email, password } = this.loginForm.controls;
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
