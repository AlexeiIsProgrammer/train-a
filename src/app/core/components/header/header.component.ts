import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthService } from '@shared/service/auth/auth.service';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule, AsyncPipe],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    readonly authService = inject(AuthService);
    readonly destroyRef = inject(DestroyRef);

    logout(): void {
        this.authService.logout().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
}
