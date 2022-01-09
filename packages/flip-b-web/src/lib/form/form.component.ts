import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../core/http.service';
import { PageService } from '../core/page.service';

@Component({
  selector: 'flb-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @Input() modal: any;
  @Input() context: any;
  @Input() options: any;

  view: any;

  list: any;
  form: any;
  data: any;
  item: any;

  constructor(public httpService: HttpService, public pageService: PageService) {}

  ngOnInit(): void {
    if (!this.context || !this.options) {
      return;
    }

    /*
     * Context
     *
     * - path: 'user/profile',
     * - name: 'user.profile.title',
     * - icon: 'person-circle',
     * - menu: '',
     * - view: 'profile',
     * - auth: ['administrator', 'supervisor', 'operator', 'user']
     */
    if (!this.context?.path) {
      this.context.path = '';
    }
    if (!this.context?.name) {
      this.context.name = '';
    }
    if (!this.context?.icon) {
      this.context.icon = '';
    }
    if (!this.context?.menu) {
      this.context.menu = '';
    }
    if (!this.context?.view) {
      this.context.view = '';
    }
    if (!this.context?.auth) {
      this.context.auth = [];
    }
    if (!this.context?.item) {
      this.context.auth = {};
    }

    /*
     * Options
     *
     * - path: '',
     * - name: '',
     * - icon: '',
     * - menu: '',
     * - view: '',
     * - auth: []
     * - search: {}
     * - select: {}
     * - create: {}
     * - update: {}
     * - delete: {}
     * - submit: {}
     * - fields: []
     */
    if (!this.options.fields) {
      this.options.fields = [];
    }

    //for (const field of this.options.fields) {
    //  this.fields.push(field);
    //}

    this.refresh();
  }

  /*
   * Refresh
   */

  refresh($event: any = null) {
    if (this.context.view == 'search') {
      this.search(this.context.params, $event);
    } else if (this.context.view == 'select') {
      this.select(this.context.params, $event);
    } else if (this.context.view == 'create') {
      this.create(this.context.params, $event);
    } else if (this.context.view == 'update') {
      this.update(this.context.params, $event);
    } else if (this.context.view == 'delete') {
      this.delete(this.context.params, $event);
    } else if (this.context.view == 'export') {
      this.export(this.context.params, $event);
    } else if (this.context.view == 'import') {
      this.import(this.context.params, $event);
    } else {
      this.custom(this.context.params, $event);
    }
  }

  /*
   * Search
   */

  async search(params: any = {}, $event: any = null): Promise<any> {
    try {
      this.pageService.showLoading({
        message: 'home.show_loading_on_search',
        delay: 3000,
        duration: 10000
      });

      this.view = 'search';
      this.data = this.pageService.data[this.options.name] = this.pageService.data[this.options.name] || {};
      this.data.order = this.data.order || { field: 'name', type: '1' };
      this.data.names = this.data.names || {};
      this.data.where = this.data.where || {};
      this.data.where.query = this.data.where.query || '';

      const filter: any = {
        where: this.data?.where || null,
        order: this.data?.order || null,
        limit: this.data?.limit || 15,
        offset: this.data?.offset || 0
      };

      if ($event?.type == 'ionInfinite') {
        this.list = this.list || [];
        filter.offset = this.list.length;
      } else {
        this.list = [];
        filter.offset = 0;
      }

      const result: any = await this.httpService.get(`${this.options.path}/`, filter);

      this.list = [...this.list, ...result];

      this.pageService.showMessageOnSearch({
        event: $event,
        value: result
      });
    } catch (error) {
      this.pageService.showMessageOnSearch({
        event: $event,
        error
      });
    }
  }

  /*
   * Select
   */

  async select(params: any = {}, $event: any = null): Promise<any> {
    try {
      this.view = 'select';
      this.form = null;
      this.item = null;

      this.pageService.showLoading({
        message: 'home.show_loading_on_select',
        delay: 1500,
        duration: 10000
      });

      const result: any = await this.httpService.get(`${this.options.path}/${params._id}`);
      this.form = this.getForm(this.options.fields, result);
      this.item = result;

      this.pageService.showMessageOnSelect({
        event: $event,
        value: result
      });
    } catch (error) {
      this.pageService.showMessageOnSelect({
        event: $event,
        error
      });
    }
  }

  /*
   * Create
   */

  async create(params: any = {}, $event: any = null): Promise<any> {
    try {
      this.view = 'create';
      this.form = this.getForm(this.options.fields, {});
      this.item = this.form.value;

      this.pageService.showMessageOnSelect({
        event: $event,
        value: params
      });
    } catch (error) {
      this.pageService.showMessageOnSelect({
        event: $event,
        error
      });
    }
  }

  /*
   * Update
   */

  async update(params: any = {}, $event: any = null): Promise<any> {
    try {
      this.view = 'update';
      this.form = null;
      this.item = null;

      this.pageService.showLoading({
        message: 'home.show_loading_on_select',
        delay: 1500,
        duration: 10000
      });

      const result: any = await this.httpService.get(`${this.options.path}/${params._id}`);
      this.form = this.getForm(this.options.fields, result);
      this.item = result;

      this.pageService.showMessageOnSelect({
        event: $event,
        value: result
      });
    } catch (error) {
      this.pageService.showMessageOnSelect({
        event: $event,
        error
      });
    }
  }

  /*
   * Delete
   */

  async delete(params: any = {}, $event: any = null): Promise<any> {
    try {
      this.view = 'delete';
      this.form = null;
      this.item = null;

      this.pageService.showLoading({
        message: 'home.show_loading_on_select',
        delay: 1500,
        duration: 10000
      });

      const result: any = await this.httpService.get(`${this.options.path}/${params._id}`);
      this.form = this.getForm(this.options.fields, result);
      this.item = result;

      this.pageService.showMessageOnSelect({
        event: $event,
        value: result
      });
    } catch (error) {
      this.pageService.showMessageOnSelect({
        event: $event,
        error
      });
    }
  }

  /*
   * Export
   */

  async export(params: any = {}, $event: any = null): Promise<any> {
    try {
      this.view = 'export';
      this.list = null;
      this.form = null;
      this.item = null;

      this.pageService.showMessageOnSelect({
        event: $event,
        value: params
      });
    } catch (error) {
      this.pageService.showMessageOnSelect({
        event: $event,
        error
      });
    }
  }

  /*
   * Import
   */

  async import(params: any = {}, $event: any = null): Promise<any> {
    try {
      this.view = 'import';
      this.list = null;
      this.form = null;
      this.item = null;

      this.pageService.showMessageOnSelect({
        event: $event,
        value: params
      });
    } catch (error) {
      this.pageService.showMessageOnSelect({
        event: $event,
        error
      });
    }
  }

  /*
   * Custom
   */

  async custom(params: any = {}, $event: any = null): Promise<any> {
    try {
      this.view = this.options.view || 'update';
      //this.list = this.options.list || null;
      //this.form = this.options.form || null;
      //this.item = this.options.item || null;

      console.log(this.options);
      console.log(typeof this.options.item);

      if (typeof this.options.item == 'function') {
        this.item = this.options.item(this);
      }
      this.form = this.getForm(this.options.fields || {}, this.item || {});
      this.item = this.item || this.form.value || null;

      this.pageService.showMessageOnSelect({
        event: $event,
        value: params
      });
    } catch (error) {
      this.pageService.showMessageOnSelect({
        event: $event,
        error
      });
    }
  }

  /*
   * Submit methods
   */

  async submit(params: any = {}, $event: any = null): Promise<any> {
    try {
      this.pageService.showLoading({
        message: 'home.show_loading_on_update',
        delay: 1500,
        duration: 10000
      });

      const method = params._id ? 'put' : 'post';
      const url = `${this.options.path}/${params._id || ''}`;
      const result: any = await this.httpService[method](url, params);

      // await this.httpService.delete(`${this.options.path}/${params._id}`)
      // await this.httpService.request({uri: '/api/v1/utils/export/' + this.options.name, body: params, method: 'POST', responseType: 'blob'});
      // await this.httpService.request({uri: '/api/v1/utils/import/' + this.options.name, body: params, method: 'POST', responseType: 'blob'});

      if (this.modal) {
        this.modal.dismiss(result);
      } else {
        this.pageService.gotoPage(`${this.options.name}/select/:_id`, { _id: result._id }, { replaceUrl: true });
      }

      this.pageService.showMessageOnUpdate({
        event: $event,
        value: params
      });
    } catch (error) {
      this.pageService.showMessageOnUpdate({
        event: $event,
        error
      });
    }
  }

  async cancel($event: any = null): Promise<any> {
    try {
      if (this.modal) {
        this.modal.dismiss();
      } else {
        this.pageService.gotoBack();
      }
    } catch (error) {
      this.pageService.showMessageOnUpdate({
        event: $event,
        error
      });
    }
  }

  async showMenu($event: any = null): Promise<any> {
    this.pageService.menuController.open();
  }

  async showFile(params?: any): Promise<any> {
    this.pageService.showFile({
      name: 'image',
      type: 'image',
      item: this.item,
      data: this
    });
  }

  async showMaps(params?: any): Promise<any> {
    return params;
  }

  /*
   * Form methods
   */

  getForm(fields: any = {}, values: any = {}): any {
    const result = new FormGroup({});
    for (const field of fields) {
      if (field.controls) {
        result.addControl(`${field.name}`, fields[`${field.name}`]);
        continue;
      }
      const validators = [];
      if (field.pattern) {
        validators.push(Validators.pattern(field.pattern));
      }
      if (field.require) {
        validators.push(Validators.required);
      }
      if (field.min) {
        validators.push(Validators.min(field.min));
      }
      if (field.max) {
        validators.push(Validators.max(field.max));
      }
      if (field.minLength) {
        validators.push(Validators.minLength(field.minLength));
      }
      if (field.maxLength) {
        validators.push(Validators.maxLength(field.maxLength));
      }
      result.addControl(`${field.name}`, new FormControl(values[`${field.name}`] || fields.default, validators));
    }
    return result;
  }

  getFormValueIsRequired(form: any, name: string): boolean {
    return form.get(name).errors && (form.get(name).dirty || form.get(name).touched) && form.get(name).hasError('required');
  }

  getFormValueIsInvalid(form: any, name: string): boolean {
    return form.get(name).errors && (form.get(name).dirty || form.get(name).touched) && !form.get(name).hasError('required');
  }

  getFormValueIsValid(form: any, name: string): boolean {
    return !form.get(name).errors || (!form.get(name).dirty && !form.get(name).touched);
  }

  getFormIsValid(form: any): boolean {
    if (!this.context.loading && form && Array.isArray(form)) {
      for (const f of form) {
        if (!f.valid) {
          return false;
        }
      }
      return true;
    }
    return form.valid && !this.context.loading;
  }

  /*
   * Service methods
   */

  auth(view: string) {
    if (view == '') {
      return;
    } else if (view == 'search' && this.pageService.authPage(`${this.options.name}/search`)) {
      return true;
    } else if (view == 'select' && this.pageService.authPage(`${this.options.name}/select/:_id`)) {
      return true;
    } else if (view == 'create' && this.pageService.authPage(`${this.options.name}/create`)) {
      return true;
    } else if (view == 'update' && this.pageService.authPage(`${this.options.name}/update/:_id`)) {
      return true;
    } else if (view == 'delete' && this.pageService.authPage(`${this.options.name}/delete/:_id`)) {
      return true;
    } else if (view == 'export' && this.pageService.authPage(`${this.options.name}/export`)) {
      return true;
    } else if (view == 'import' && this.pageService.authPage(`${this.options.name}/import`)) {
      return true;
    }
    return false;
  }

  goto(view: string, item: any = {}) {
    if (this.modal) {
      return this.modal.dismiss(item);
    }
    if (view == '') {
      return;
    } else if (view == 'search') {
      this.pageService.gotoPage(`${this.options.name}/search`, item);
    } else if (view == 'select') {
      return this.pageService.gotoPage(`${this.options.name}/select/:_id`, item);
    } else if (view == 'create') {
      return this.pageService.gotoPage(`${this.options.name}/create`, item);
    } else if (view == 'update') {
      return this.pageService.gotoPage(`${this.options.name}/update/:_id`, item);
    } else if (view == 'delete') {
      return this.pageService.gotoPage(`${this.options.name}/delete/:_id`, item);
    } else if (view == 'export') {
      return this.pageService.gotoPage(`${this.options.name}/export`, item);
    } else if (view == 'import') {
      return this.pageService.gotoPage(`${this.options.name}/import`, item);
    } else {
      return this.pageService.gotoPage(view, item);
    }
  }
}
