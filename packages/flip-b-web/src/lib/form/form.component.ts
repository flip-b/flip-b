import {Component, OnInit, Input, HostBinding, ElementRef} from '@angular/core';
import {Form} from '../core/classes/form';
import {ContextService} from '../core/context.service';

@Component({
  selector: 'flb-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  // Definitions

  @HostBinding('class') _elementClass: any;
  @HostBinding('style') _elementStyle: any;

  /**
   * Modal
   * @attribute {Object}
   */
  @Input() modal: any;

  /**
   * Form
   * @attribute {Form}
   */
  @Input() form: Form | any;

  /**
   * Constructor
   */
  constructor(public _context: ContextService, public _element: ElementRef) {}

  /**
   * Init angular handler
   */
  async ngOnInit(): Promise<any> {
    if (this.form?.constructor?.name !== 'Form') {
      this.form = new Form(this.form);
      await this.form.onInit();
    }
    await this.form.setComponent(this);

    //console.log('FORM', this.form?.constructor?.name);
    //this.form = this.form?.constructor?.name !== 'Form' ? new Form(this.form) : this.form;
    //this.form.setComponent(this);
  }
}
