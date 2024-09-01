import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { isEmail } from '@shared/form-validators/email.validator';
import { hasGaps } from '@shared/form-validators/has-gaps.validator';
import { required } from '@shared/form-validators/required.validator';
import { GetControlErrorMessagePipe } from '@shared/pipes/get-control-error-message/get-control-error-message.pipe';
import { AuthService } from '@shared/service/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from './services/profile/profile.service';
import { PasswordChangerComponent } from './password-changer/password-changer.component';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
        MatCardModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIcon,
        MatInputModule,
        MatButtonModule,
        GetControlErrorMessagePipe,
        MatProgressSpinnerModule,
    ],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit {
    isEditMode = false;
    isSaving = false;

    readonly profileForm = this.formBuilder.nonNullable.group({
        name: [''],
        email: ['', [required(), hasGaps, isEmail]],
        role: [''],
    });

    constructor(
        private readonly router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly profileService: ProfileService,
        private readonly destroyRef: DestroyRef,
        private readonly matDialog: MatDialog,
    ) {}

    getProfile(): void {
        this.profileService.getProfile().subscribe({
            next: profile => {
                this.profileForm.patchValue({ ...profile });
            },
            error: () => {
                this.router.navigateByUrl('404');
            },
        });
    }

    ngOnInit(): void {
        this.getProfile();
    }

    changeValues(): void {
        this.isEditMode = true;
    }

    updateValues(): void {
        const formValue = this.profileForm.getRawValue();

        this.isSaving = true;
        this.profileService.updateProfile(formValue).subscribe({
            next: () => {
                this.isSaving = false;
                this.isEditMode = false;
                this.getProfile();
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

    logout(): void {
        this.authService
            .logout()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.router.navigateByUrl('');
            });
    }

    private handleErr(message?: string): void {
        const { email } = this.profileForm.controls;
        const controlErr = { error: message };

        if (message?.match(/([Ee]mail|[Uu]ser)/)) {
            email.setValue('');
            email.setErrors(controlErr);
        }
    }

    openDialog(): void {
        this.matDialog.open(PasswordChangerComponent);
    }
}
