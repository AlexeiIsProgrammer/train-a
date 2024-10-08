import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-edit',
    standalone: true,
    imports: [MatIcon],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent {
    @ViewChild(MatIcon, { static: true }) icon!: MatIcon;
    @Input() position: 'left' | 'right' = 'left';

    @Output() toggle = new EventEmitter<void>();

    private is_edit = false;

    edit(): void {
        this.is_edit = !this.is_edit;

        this.toggle.emit();
    }

    get isEdit(): boolean {
        return this.is_edit;
    }
}
