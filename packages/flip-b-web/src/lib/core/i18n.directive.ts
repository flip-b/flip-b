import {Directive, OnInit, Input, ElementRef} from '@angular/core';
import {Item} from './classes/item';
import {DataService} from './data.service';

@Directive({
  selector: '[flbI18n]'
})
export class I18nDirective implements OnInit {
  // Definitions

  /**
   * I18n
   */
  @Input() flbI18n: Item | undefined;

  /**
   * Type
   */
  @Input() flbType = 'title';

  /**
   * Constructor
   */
  constructor(private data: DataService, private _element: ElementRef) {}

  /**
   * Init angular handler
   */
  ngOnInit() {
    //if (this.flbI18n?._config) {
    //}
    //this._element.nativeElement.innerHTML = ''
    //this._element.nativeElement.innerHTML = `<div class="flb-item-${this.flbType}">${this.flbI18n._config.text.title || this.flbI18n._config.name || ''}</div>`;
    //this._element.nativeElement.style.backgroundColor = 'yellow';
    //console.log(this.data.i18n.getLocale());
    console.log(this.data, this._element);
  }
}
