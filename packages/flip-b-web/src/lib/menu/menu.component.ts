import {Component, OnInit, Input, HostBinding, ElementRef} from '@angular/core';
import {Menu} from '../core/classes/menu';
import {ContextService} from '../core/context.service';

@Component({
  selector: 'flb-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  // Definitions

  @HostBinding('class') _elementClass: any;
  @HostBinding('style') _elementStyle: any;

  /**
   * Modal
   * @attribute {Object}
   */
  @Input() modal: any;

  /**
   * Menu
   * @attribute {Menu}
   */
  @Input() menu: Menu | any;

  /**
   * Constructor
   */
  constructor(public _context: ContextService, public _element: ElementRef) {}

  /**
   * Init angular handler
   */
  ngOnInit() {
    this.menu = this.menu?.constructor?.name !== 'Menu' ? new Menu(this.menu) : this.menu;
    this.menu.setComponent(this);
  }
}
