import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-delete',
    standalone: true,
    imports: [MatButtonModule, MatDialogModule],
    templateUrl: './confirm-delete.component.html',
    styleUrl: './confirm-delete.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteComponent {}
