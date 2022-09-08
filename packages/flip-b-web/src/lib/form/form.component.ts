import {Component, OnInit, Input, HostBinding, ElementRef} from '@angular/core';
import {Form} from '../core/classes/form';
import {DataService} from '../core/data.service';

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
   */
  @Input() modal: any;

  /**
   * Form
   */
  @Input() form: Form | any;

  /**
   * Constructor
   */
  constructor(public data: DataService, public _element: ElementRef) {}

  /**
   * Init angular handler
   */
  ngOnInit() {
    this.form = this.form?.constructor?.name !== 'Form' ? new Form(this.form) : this.form;
    this.form.setComponent(this);
  }
}
