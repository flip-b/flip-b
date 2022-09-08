import {Component, OnInit, Input, HostBinding, HostListener, ElementRef} from '@angular/core';
import {Page} from '../core/classes/page';
import {DataService} from '../core/data.service';

@Component({
  selector: 'flb-page',
  templateUrl: './page.component.html'
})
export class PageComponent implements OnInit {
  // Definitions

  @HostBinding('class') _elementClass: any;
  @HostBinding('style') _elementStyle: any;
  @HostListener('scroll', ['$event']) private onScroll($event: Event) {
    this.page?.onScroll($event);
  }

  /**
   * Modal
   */
  @Input() modal: any;

  /**
   * Page
   */
  @Input() page: Page | any;

  /**
   * Constructor
   */
  constructor(public data: DataService, public _element: ElementRef) {}

  /**
   * Init angular handler
   */
  async ngOnInit(): Promise<any> {
    if (typeof this.page === 'undefined' || typeof this.page.load === 'function') {
      this.page = await this.data.loadPage();
    }
    this.page = this.page?.constructor?.name !== 'Page' ? new Page(this.page) : this.page;
    this.page.setComponent(this);
    console.log(this);
  }
}
