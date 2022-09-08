import {Component, OnInit, Input, HostBinding, ElementRef} from '@angular/core';
import {Item} from '../core/classes/item';
import {DataService} from '../core/data.service';

@Component({
  selector: 'flb-item-datetime',
  templateUrl: './item-datetime.component.html'
})
export class ItemDatetimeComponent implements OnInit {
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
   * Constructor
   */
  constructor(public data: DataService, public _element: ElementRef) {}

  /**
   * Init angular handler
   */
  ngOnInit() {
    this.item = this.item?.constructor?.name !== 'Item' ? new Item(this.item) : this.item;
    this.item.setComponent(this);

    this._elementClass = 'flb-item-datetime';
    this._elementStyle = {};

    this.value = this.value || this.item.value || new Date().toISOString();
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
  onChange($event: any) {
    if (this.item._config.readonly) {
      return;
    }
    this.value = $event.target.value || undefined;
    console.log('New value', this.value);
  }
}
