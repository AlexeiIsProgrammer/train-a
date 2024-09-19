import { ElementRef, Renderer2 } from '@angular/core';
import { SeatBackgroundDirective } from './seat-background.directive';

describe('SeatBackgroundDirective', () => {
    let directive: SeatBackgroundDirective;
    let mockElementRef: ElementRef;
    let mockRenderer: Renderer2;

    beforeEach(() => {
        mockElementRef = new ElementRef(document.createElement('div'));
        mockRenderer = {
            setStyle: jest.fn(),
        } as unknown as Renderer2;

        directive = new SeatBackgroundDirective(mockElementRef, mockRenderer);
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('should set background color and text color when seatBackground is true', () => {
        directive.seatBackground = true;
        directive.ngOnChanges({
            seatBackground: {
                currentValue: true,
                previousValue: undefined,
                firstChange: false,
                isFirstChange: function (): boolean {
                    throw new Error('Function not implemented.');
                },
            },
        });

        expect(mockRenderer.setStyle).toHaveBeenCalledWith(
            mockElementRef.nativeElement,
            'background-color',
            'rgb(0, 0, 147)',
        );
        expect(mockRenderer.setStyle).toHaveBeenCalledWith(
            mockElementRef.nativeElement,
            'color',
            'white',
        );
    });

    it('should set background color to gray when seatBackground is false', () => {
        directive.seatBackground = false;
        directive.ngOnChanges({
            seatBackground: {
                currentValue: false,
                previousValue: undefined,
                firstChange: false,
                isFirstChange: function (): boolean {
                    throw new Error('Function not implemented.');
                },
            },
        });

        expect(mockRenderer.setStyle).toHaveBeenCalledWith(
            mockElementRef.nativeElement,
            'background-color',
            'gray',
        );
    });

    it('should apply styles when seatBackground is changed from false to true', () => {
        directive.seatBackground = false;
        directive.ngOnChanges({
            seatBackground: {
                currentValue: false,
                previousValue: undefined,
                firstChange: false,
                isFirstChange: function (): boolean {
                    throw new Error('Function not implemented.');
                },
            },
        });

        directive.seatBackground = true;
        directive.ngOnChanges({
            seatBackground: {
                currentValue: true,
                previousValue: undefined,
                firstChange: false,
                isFirstChange: function (): boolean {
                    throw new Error('Function not implemented.');
                },
            },
        });

        expect(mockRenderer.setStyle).toHaveBeenCalledWith(
            mockElementRef.nativeElement,
            'background-color',
            'rgb(0, 0, 147)',
        );
        expect(mockRenderer.setStyle).toHaveBeenCalledWith(
            mockElementRef.nativeElement,
            'color',
            'white',
        );
    });
});
