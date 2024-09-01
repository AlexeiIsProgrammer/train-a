import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { hasGaps } from '@shared/form-validators/has-gaps.validator';
import { length } from '@shared/form-validators/length.validator';
import { required } from '@shared/form-validators/required.validator';
import { GetControlErrorMessagePipe } from '@shared/pipes/get-control-error-message/get-control-error-message.pipe';
import { ProfileService } from '../services/profile/profile.service';

@Component({
    selector: 'app-password-changer',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        ReactiveFormsModule,
        MatIcon,
        GetControlErrorMessagePipe,
    ],
    templateUrl: './password-changer.component.html',
    styleUrl: './password-changer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordChangerComponent {
    readonly dialogRef = inject(MatDialogRef<PasswordChangerComponent>);

    isSaving = false;
    isPasswordHide = true;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly profileService: ProfileService,
    ) {}

    readonly passwordForm = this.formBuilder.nonNullable.group({
        password: [
            '',
            [required(), hasGaps, length('min', 8, 'Password must be at least 8 characters long')],
        ],
    });

    save(): void {
        this.isSaving = true;
        this.profileService
            .updatePassword(this.passwordForm.controls.password.value)
            .subscribe(() => {
                this.isSaving = false;
                this.dialogRef.close();
            });
    }
}
