import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[flbMask]'
})
export class MaskDirective {
  @Input('flbMask') highlightColor = '';

  constructor(private el: ElementRef) {
    this.highlight('');
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor || '');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
