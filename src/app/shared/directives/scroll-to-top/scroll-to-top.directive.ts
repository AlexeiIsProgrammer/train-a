import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[appScrollToTop]',
    standalone: true,
    exportAs: 'scrollToTop',
})
export class ScrollToTopDirective {
    constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

    scrollToTop(): void {
        const { nativeElement } = this.elementRef;

        nativeElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
}
