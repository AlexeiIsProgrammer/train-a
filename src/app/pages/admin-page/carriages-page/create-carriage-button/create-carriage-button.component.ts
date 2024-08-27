import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-create-carriage-button',
    standalone: true,
    imports: [MatButtonModule],
    templateUrl: './create-carriage-button.component.html',
    styleUrl: './create-carriage-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCarriageButtonComponent {
    @Output() createClicked: EventEmitter<void> = new EventEmitter<void>();

    onCreateClick() {
        this.createClicked.emit();
    }
}
