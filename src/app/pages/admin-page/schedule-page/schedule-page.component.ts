import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-schedule-page',
    standalone: true,
    imports: [],
    templateUrl: './schedule-page.component.html',
    styleUrl: './schedule-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulePageComponent {
    @Input() set id(id: string) {
        this.setTitle(id);
    }

    constructor(private readonly title: Title) {}

    setTitle(id: string): void {
        this.title.setTitle(`Route №${id}`);
    }
}
