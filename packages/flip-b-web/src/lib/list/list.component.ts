import {Component, OnInit, Input, HostBinding, ElementRef} from '@angular/core';
import {List} from '../core/classes/list';
import {ContextService} from '../core/context.service';

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
   * @attribute {Object}
   */
  @Input() modal: any;

  /**
   * List
   * @attribute {List}
   */
  @Input() list: List | any;

  /**
   * Constructor
   */
  constructor(public _context: ContextService, public _element: ElementRef) {}

  /**
   * Init angular handler
   */
  async ngOnInit(): Promise<any> {
    if (this.list?.constructor?.name !== 'List') {
      this.list = new List(this.list);
      await this.list.onInit();
    }
    await this.list.setComponent(this);

    //console.log('LIST', this.list?.constructor?.name);
    //this.list = this.list?.constructor?.name !== 'List' ? new List(this.list) : this.list;
    //this.list.setComponent(this);
  }
}
