import {Component, OnInit, Input, ElementRef, HostListener, ViewChild} from '@angular/core';
import {IonContent, InfiniteScrollCustomEvent} from '@ionic/angular';
import {DataService} from '../core/data.service';

@Component({
  selector: 'flb-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  // Definitions

  @ViewChild(IonContent) content: IonContent | any;

  /**
   * View
   */
  @Input() view: any;

  /**
   * Form
   */
  @Input() form: any;

  /**
   * Modal
   */
  @Input() modal: any;

  /**
   * Constructor
   */
  constructor(public data: DataService, public _element: ElementRef) {}


  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

  onIonInfinite(event: any) {
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  scrollToBottom() {
    // Passing a duration to the method makes it so the scroll slowly
    // goes to the bottom instead of instantly
    this.content.scrollToBottom(500);
  }

  scrollToTop() {
    // Passing a duration to the method makes it so the scroll slowly
    // goes to the top instead of instantly
    this.content.scrollToTop(500);
  }  

  /**
   * Init angular handler
   */
  async ngOnInit(): Promise<any> {

    if (typeof this.view === 'undefined') {
      const snap: any = this.data._router.routerState.snapshot.root.firstChild;
      const view: any = {};
      view.name = snap.data.name || undefined;
      view.type = snap.data.type || undefined;
      view.rest = snap.data.rest || undefined;
      view.form = snap.data.form || undefined;
      view.data = {...snap.params, ...snap.queryParams, ...history.state};
      delete view.data.navigationId;
      this.view = view;
    }

    if (typeof this.view === 'function') {
      this.view = this.data.clone(await this.view());
    } else {
      this.view = this.view || {};
    }

    if (typeof this.form === 'function') {
      this.form = this.data.clone(await this.form());
    } else {
      this.form = this.form || {};
    }

    if (typeof this.view.form === 'function') {
      this.form = this.data.clone(await this.view.form());
    }

    if (typeof this.form.view === 'function') {
      this.view = this.data.clone(await this.form.view());
    }

    this.view = await this.formatView(this.view);
    await this.trigger('view.onSetup');

    this.form = await this.formatForm(this.form);
    await this.trigger('form.onSetup');

    for (const t of ['header', 'footer', 'navbar', 'filter', 'metric', 'fields', 'values']) {
      this.form[t] = await Promise.all(this.form[t].map(async (i: any) => await this.formatItem(i, {}, t)));

      if (!this.form[t].find((f: any) => f.type !== 'expand' && !f.hide)) {
        this.form[t] = [];
      }
    }

    this._element.nativeElement.className = `flb-form flb-form-type-${this.view.type} flb-form-name-${this.view.name}`;
    this._element.nativeElement.style = {};
    this.view.init = true;

    await this.trigger('form.onSelect');
    console.log(this);
  }

  /**
   * Scroll event handler
   */
  @HostListener('scroll', ['$event']) async onScroll($event: any) {
    const pos: number = this._element.nativeElement.scrollTop + this._element.nativeElement.offsetHeight;
    const max: number = this._element.nativeElement.scrollHeight;
    if (pos > 0 && pos >= max) {
      return await this.trigger('form.onScroll', undefined, $event);
    }
  }

  /**
   * Format view
   */
  async formatView(view: any = {}): Promise<any> {
    const result: any = {};

    // Define name
    // @param {String}
    result.name = view.name || '';

    // Define type
    // @param {String}
    result.type = view.type || '';

    // Define rest
    // @param {String}
    result.rest = view.rest || undefined;

    // Define form
    // @param {Object}
    result.form = view.form || undefined;

    // Define data
    // @param {Object}
    result.data = view.data || {};

    // Define events
    // @param {Funtion}
    for (const e in view) {
      if (typeof view[e] === 'function' && e.match(/^on[A-Z][A-Za-z]+/)) {
        result[e] = view[e];
      }
    }

    // Return view
    return result;
  }

  /**
   * Format form
   */
  async formatForm(form: any = {}): Promise<any> {
    const result: any = {};

    // Define header
    // @param {Array}
    result.header = this.data.clone(form.header || []);

    // Define header class
    // @param {String}
    result.headerClass = form.headerClass || undefined;

    // Define header style
    // @param {Object}
    result.headerStyle = form.headerStyle || undefined;

    // Define footer
    // @param {Array}
    result.footer = this.data.clone(form.footer || []);

    // Define footer class
    // @param {String}
    result.footerClass = form.footerClass || undefined;

    // Define footer style
    // @param {Object}
    result.footerStyle = form.footerStyle || undefined;

    // Define navbar
    // @param {Array}
    result.navbar = this.data.clone(form.navbar || []);

    // Define navbar class
    // @param {String}
    result.navbarClass = form.navbarClass || undefined;

    // Define navbar style
    // @param {Object}
    result.navbarStyle = form.navbarStyle || undefined;

    // Define filter
    // @param {Array}
    result.filter = this.data.clone(form.filter || []);

    // Define filter class
    // @param {String}
    result.filterClass = form.filterClass || undefined;

    // Define filter style
    // @param {Object}
    result.filterStyle = form.filterStyle || undefined;

    // Define metric
    // @param {Array}
    result.metric = this.data.clone(form.metric || []);

    // Define metric class
    // @param {String}
    result.metricClass = form.metricClass || undefined;

    // Define metric style
    // @param {Object}
    result.metricStyle = form.metricStyle || undefined;

    // Define fields
    // @param {Array}
    result.fields = this.data.clone(form.fields || []);

    // Define fields class
    // @param {String}
    result.fieldsClass = form.fieldsClass || undefined;

    // Define fields style
    // @param {Object}
    result.fieldsStyle = form.fieldsStyle || undefined;

    // Define values
    // @param {Array}
    result.values = this.data.clone(form.values || []);

    // Define values class
    // @param {String}
    result.valuesClass = form.valuesClass || undefined;

    // Define values style
    // @param {Object}
    result.valuesStyle = form.valuesStyle || undefined;

    // Define events
    // @param {Funtion}
    for (const e in form) {
      if (typeof form[e] === 'function' && e.match(/^on[A-Z][A-Za-z]+/)) {
        result[e] = form[e];
      }
    }

    // Return form
    return result;
  }

  /**
   * Format item
   */
  async formatItem(item: any = {}, root: any = {}, type: any = undefined): Promise<any> {
    const result: any = {};

    // Define name
    // @param {String}
    result.name = item.name || '';

    // Define type
    // @param {String}
    result.type = item.type || '';

    // Define text
    // @param {Object}
    result.text = item.text || {};

    // Define hide
    // @param {Boolean}
    result.hide = item.hide || undefined;

    // Define size
    // @param {Number}
    result.size = item.size || undefined;

    // Define slot
    // @param {String}
    result.slot = item.slot || undefined;

    // Define icon
    // @param {String}
    result.icon = item.icon || undefined;

    // Define icon color
    // @param {String}
    result.iconColor = item.iconColor || undefined;

    // Define icon only
    // @param {Boolean}
    result.iconOnly = item.iconOnly || undefined;

    // Define icon style
    // @param {Object}
    result.iconStyle = item.iconStyle || undefined;

    // Define default
    // @param {Mixed}
    result.default = item.default || undefined;

    // Define require
    // @param {Boolean}
    result.require = item.require || undefined;

    // Define pattern
    // @param {RegEx}
    result.pattern = item.pattern || undefined;

    // Define max
    // @param {Number}
    result.max = item.max || undefined;

    // Define max length
    // @param {Number}
    result.maxLength = item.maxLength || undefined;

    // Define min
    // @param {Number}
    result.min = item.min || undefined;

    // Define min length
    // @param {Number}
    result.minLength = item.minLength || undefined;

    // Define readonly
    // @param {Boolean}
    result.readonly = item.readonly || undefined;

    // Define disabled
    // @param {Boolean}
    result.disabled = item.disabled || undefined;

    // Define is button
    // @param {Boolean}
    result.isButton = item.isButton || undefined;

    // Define class
    // @param {String}
    result.class = item.class || undefined;

    // Define style
    // @param {Object}
    result.style = item.style || undefined;

    // Define items
    // @param {Array}
    result.items = item.items || undefined;

    // Define error
    // @param {Mixed}
    result.error = item.error || undefined;

    // Define value
    // @param {Mixed}
    result.value = item.value || undefined;

    // Define events
    // @param {Funtion}
    for (const e in item) {
      if (typeof item[e] === 'function' && e.match(/^on[A-Z][A-Za-z]+/)) {
        result[e] = item[e];
      }
    }

    if (typeof result.text === 'string') {
      result.text = {title: result.text};
    }

    // Define i18n
    result._i18n = `${root._i18n || this.view.name}.${item.name}`;

    // Define root
    result._root = root;

    // Define root
    result._type = type;

    // Setup
    await this.trigger('item.onSetup', result);

    // Return item
    return result;
  }

  /**
   * Trigger
   */
  async trigger(name: string, item: any = undefined, $event: any = undefined): Promise<any> {
    let result: any;
    const params: any = {self: this, data: this.data, view: this.view, form: this.form, item, result, $event: new CustomEvent(name, {detail: {$event}})};
    const events: any = item ? [name, `${item.type}.${name}`] : [name, `${this.view.type}.${name}`];
    for (const e of events) {
      if (typeof this.data.events[e] === 'function') {
        try {
          result = await this.data.events[e](params);
          if (typeof result === 'boolean') {
            break;
          }
        } catch (error: any) {
          result = false;
          break;
        }
      }
    }
    this._element.nativeElement.dispatchEvent(new CustomEvent(name, {detail: params}));
    return result;
  }
}
