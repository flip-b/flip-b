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
      const data: any = snap.data['page'] || {};
      const page: any = {...this.page || {}};
      page.name = page.name || data.name || undefined;
      page.type = page.type || data.type || undefined;
      page.mode = page.mode || data.mode || undefined;
      page.load = page.load || data.load || undefined;
      page.params = this.clone({...snap.params, ...snap.queryParams, ...history.state});
      delete page.params.navigationId;

      if (typeof page.load === 'function') {
        this.page = {...this.clone(page), ...this.clone((await page.load()))};
      }
    }
    this.page = this.page?.constructor?.name !== 'Page' ? new Page(this.page) : this.page;
    this.page.setComponent(this);
  }

  /**
   * Clone
   */
  clone(value: any): any {
    if (typeof value !== 'object' || value === null || value instanceof RegExp) {
      return value;
    }
    let clone: any;
    if (Array.isArray(value)) {
      clone = [...value];
    } else {
      clone = {...value};
    }
    for (const k in clone) {
      clone[k] = this.clone(clone[k]);
    }
    return clone;
  }
}
