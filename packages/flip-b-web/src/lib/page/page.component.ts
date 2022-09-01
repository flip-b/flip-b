import {Component, OnInit, Input, HostBinding, HostListener, ElementRef} from '@angular/core';
import {Page} from '../core/classes/page';
import {ContextService} from '../core/context.service';

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
   * @attribute {Object}
   */
  @Input() modal: any;

  /**
   * Page
   * @attribute {Page}
   */
  @Input() page: Page | any;

  /**
   * Constructor
   */
  constructor(public _context: ContextService, public _element: ElementRef) {}

  /**
   * Init angular handler
   */
  async ngOnInit(): Promise<any> {

    if (this.page?.constructor?.name !== 'Page') {
      const snap: any = this._context.page.router.routerState.snapshot.root.firstChild;
      const page: any = snap.data['page'] || {};
      this.page = this.page || {};
      this.page.name = this.page.name || page.name || undefined;
      this.page.type = this.page.type || page.type || undefined;
      this.page.mode = this.page.mode || page.mode || undefined;
      this.page.load = this.page.load || page.load || undefined;
      this.page.params = {...snap.params, ...snap.queryParams, ...history.state};
      delete this.page.params.navigationId;
    }

    if (this.page?.constructor?.name !== 'Page') {
      this.page = new Page(this.page);
      await this.page.onInit();
    }

    await this.page.setComponent(this);

    //console.log('PAGE', this.page?.constructor?.name);
    //this.page = this.page?.constructor?.name !== 'Page' ? new Page(this.page) : this.page;
    //this.page.setComponent(this);
  }
}
