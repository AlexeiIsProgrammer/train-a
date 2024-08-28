import { Directive, ElementRef, Input, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[appSeatBackground]',
    standalone: true,
})
export class SeatBackgroundDirective implements OnChanges {
    @Input() seatBackground: string | number = 0;

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
        if (this.seatBackground === 1) {
            this.renderer.setStyle(this.el.nativeElement, 'background-color', 'rgb(0, 0, 147)');
            this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
        } else if (this.seatBackground === 0) {
            this.renderer.setStyle(this.el.nativeElement, 'background-color', 'gray');
        }
    }
}
