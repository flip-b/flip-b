import {Component, OnInit, Input, HostBinding, ElementRef} from '@angular/core';
import {Item} from '../core/classes/item';
import {ContextService} from '../core/context.service';

@Component({
  selector: 'flb-item',
  templateUrl: './item.component.html'
})
export class ItemComponent implements OnInit {
  // Definitions

  @HostBinding('class') _elementClass: any;
  @HostBinding('style') _elementStyle: any;

  /**
   * Modal
   * @attribute {Object}
   */
  @Input() modal: any;

  /**
   * Item
   * @attribute {Item}
   */
  @Input() item: Item | any;

  /**
   * Constructor
   */
  constructor(public _context: ContextService, public _element: ElementRef) {}

  /**
   * Init angular handler
   */
  async ngOnInit(): Promise<any> {
    if (this.item?.constructor?.name !== 'Item') {
      this.item = new Item(this.item);
      await this.item.onInit();
    }
    await this.item.setComponent(this);

    //console.log('ITEM', this.item?.constructor?.name);
    //this.item = this.item?.constructor?.name !== 'Item' ? new Item(this.item) : this.item;
    //this.item.setComponent(this);
  }



  /**
   * Using
   * @attribute {Array}
   */
  using: any = [];

  /**
   * Items
   * @attribute {Array}
   */
  items: any = [
    {title: 'b', index: 'B', value: 'bold'},
    {title: 'i', index: 'I', value: 'italic'},
    {title: 'u', index: 'U', value: 'underline'},
    {title: 's', index: 'STRIKE', value: 'strikethrough'}
  ];

  /**
   * Input event handler
   */
  onInput($event: any) {
    const ws: any = window.getSelection();
    if (ws) {
      this.using = [];
      for (let i = 0; i < ws.rangeCount; i++) {
        let $s: any = ws.getRangeAt(i).startContainer;
        let $c = 0;
        while ($s?.parentNode && !$event.currentTarget.isEqualNode($s.parentNode) && $c < 100) {
          this.using.push($s.parentNode.nodeName);
          $s = $s.parentNode;
          $c++;
        }
      }
    }
  };

  /**
   * Click item event handler
   */
  onClickItem(item: any) {
    const i = this.using.indexOf(item.index);
    if (i === -1) {
      this.using.push(item.index);
    } else {
      this.using.splice(i, 1);
    }
    document.execCommand(item.value);
  }
}
