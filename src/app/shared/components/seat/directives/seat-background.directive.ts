import { Directive, ElementRef, Input, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[appSeatBackground]',
    standalone: true,
})
export class SeatBackgroundDirective implements OnChanges {
    @Input() seatBackground = false;

    constructor(
        private readonly el: ElementRef,
        private readonly renderer: Renderer2,
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['seatBackground']) {
            this.updateBackground();
        }
    }

    private updateBackground() {
        if (this.seatBackground) {
            this.renderer.setStyle(this.el.nativeElement, 'background-color', 'rgb(0, 0, 147)');
            this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
        } else {
            this.renderer.setStyle(this.el.nativeElement, 'background-color', 'gray');
        }
    }
}
