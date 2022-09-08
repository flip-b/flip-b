import {Component, OnInit, Input, HostBinding, ElementRef} from '@angular/core';
import {List} from '../core/classes/list';
import {DataService} from '../core/data.service';

@Component({
  selector: 'flb-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  // Definitions

  @HostBinding('class') _elementClass: any;
  @HostBinding('style') _elementStyle: any;

  /**
   * Modal
   */
  @Input() modal: any;

  /**
   * List
   */
  @Input() list: List | any;

  /**
   * Constructor
   */
  constructor(public data: DataService, public _element: ElementRef) {}

  /**
   * Init angular handler
   */
  ngOnInit() {
    this.list = this.list?.constructor?.name !== 'List' ? new List(this.list) : this.list;
    this.list.setComponent(this);
  }
}
