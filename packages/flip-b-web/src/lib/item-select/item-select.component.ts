import {Component, OnInit, Input, HostBinding, ElementRef} from '@angular/core';
import {Item} from '../core/classes/item';
import {DataService} from '../core/data.service';

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
   */
  @Input() modal: any;

  /**
   * Item
   */
  @Input() item: Item | any;

  /**
   * Value
   */
  @Input() value: any;

  /**
   * Items
   */
  @Input() items: any;

  /**
   * Constructor
   */
  constructor(public data: DataService, public _element: ElementRef) {}

  /**
   * Init angular handler
   */
  ngOnInit() {
    this.item = this.item?.constructor?.name !== 'Item' ? new Item(this.item) : this.item;
    this.item.setComponent(this);

    this._elementClass = 'flb-item-select';
    this._elementStyle = {};

    this.value = this.value || this.item.value || undefined;
    this.items = this.items || ['Item A', 'Item B'];
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
    console.log('New value', this.value);
  }
}
