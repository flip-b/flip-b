import {Component, OnInit, Input, HostBinding, ElementRef} from '@angular/core';
import {Item} from '../core/classes/item';
import {DataService} from '../core/data.service';

@Component({
  selector: 'flb-item',
  templateUrl: './item.component.html'
})
export class ItemComponent implements OnInit {
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
   * Constructor
   */
  constructor(public data: DataService, public _element: ElementRef) {}

  /**
   * Init angular handler
   */
  ngOnInit() {
    this.item = this.item?.constructor?.name !== 'Item' ? new Item(this.item) : this.item;
    this.item.setComponent(this);
  }
}
