import {Component, OnInit, Input, HostBinding, HostListener, ElementRef} from '@angular/core';
import {Menu} from '../core/classes/menu';
import {DataService} from '../core/data.service';

@Component({
  selector: 'flb-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  // Definitions

  @HostBinding('class') _elementClass: any;
  @HostBinding('style') _elementStyle: any;
  @HostListener('scroll', ['$event']) private onScroll($event: Event) {
    this.menu?.onScroll($event);
  }

  /**
   * Modal
   */
  @Input() modal: any;

  /**
   * Menu
   */
  @Input() menu: Menu | any;

  /**
   * Constructor
   */
  constructor(public data: DataService, public _element: ElementRef) {}

  /**
   * Init angular handler
   */
  async ngOnInit(): Promise<any> {
    if (typeof this.menu === 'undefined' || typeof this.menu.load === 'function') {
      this.menu = await this.data.loadMenu();
    }
    this.menu = this.menu?.constructor?.name !== 'Menu' ? new Menu(this.menu) : this.menu;
    this.menu.setComponent(this);
    console.log(this);
  }
}
