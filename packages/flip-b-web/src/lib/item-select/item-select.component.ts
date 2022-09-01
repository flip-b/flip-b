import {Component, OnInit, Input, HostBinding, ElementRef} from '@angular/core';
import {Item} from '../core/classes/item';
import {ContextService} from '../core/context.service';

@Component({
  selector: 'flb-item-select',
  templateUrl: './item-select.component.html'
})
export class ItemSelectComponent implements OnInit {
  // Definitions

  @HostBinding('class') _elementClass: any;
  @HostBinding('style') _elementStyle: any;

  /**
   * Modal
   * @attribute {Object}
   */
  @Input() modal: any;

  /**
   * Item
   * @attribute {Item}
   */
  @Input() item: Item | any;

  /**
   * Value
   * @attribute {Mixed}
   */
  @Input() value: any;

  /**
   * Items
   * @attribute {Array}
   */
  @Input() items: any;

  /**
   * Constructor
   */
  constructor(public _context: ContextService, public _element: ElementRef) {}

  /**
   * Init angular handler
   */
  ngOnInit() {
    if (this.item?.constructor?.name !== 'Item') {
      this.item = new Item(this.item);
      this.item.setComponent(this);
    }
    this.value = this.value || this.item.value || undefined;
    this.items = this.items || ['Item A', 'Item B'];
    this._elementClass = 'flb-item-select';
    this._elementStyle = {};
    //this.populate()
  }

  /**
   * Apply event handler
   */
  onApply($event: any) {
    $event = new CustomEvent('onApply', {detail: {$event, value: this.value}});
    this._element.nativeElement.value = this.value;
    this._element.nativeElement.dispatchEvent($event);
    if (this.modal) {
      this.modal.dismiss($event);
    }
  }

  /**
   * Close event handler
   */
  onClose($event: any) {
    $event = new CustomEvent('onClose', {detail: {$event, value: this.value}});
    this._element.nativeElement.value = this.value;
    this._element.nativeElement.dispatchEvent($event);
    if (this.modal) {
      this.modal.dismiss();
    }
  }

  /**
   * Change event handler
   */
  onChange($event: any, value: any) {
    if (this.item._config.readonly) {
      return;
    }
    this.value = value;
    console.log(`New value "${this.value}"`);
  }

  /**
   * Populate
   */
  private async populate(): Promise<any> {
    const params: any = {
      uri: `/api/v1/${this.item._uid.split('.')[0]}`,
      method: 'GET',
      qs: {facet: this.item.name}
    };
    const value: any = await this._context.http.request(params);
    if (this.item.require) {
      this.items = value.filter((r: any) => !!r.index);
    } else {
      this.items = value;
    }
  }
}
