import { Component } from '@angular/core';
import { Page } from '@flip-b/web';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss']
})
export class ProductsPage extends Page {
  options: any = {
    name: 'products',
    path: '/api/v1/products',
    fields: [
      {
        name: '_id',
        type: 'id',
        size: '100',
        default: undefined,
        pattern: /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i,
        require: false
      },
      {
        name: 'name',
        type: 'text',
        size: '50',
        default: undefined,
        pattern: /^.{0,255}$/,
        require: true
      },
      {
        name: 'group',
        type: 'select',
        size: '50',
        values: 'accounts_groups',
        default: undefined,
        pattern: /^.{0,255}$/,
        require: true
      },
      {
        name: 'image',
        type: 'url',
        size: '100',
        default: undefined,
        pattern: /^https?:\/\/.*$/,
        require: false
      },
      {
        name: 'notes',
        type: 'text',
        size: '100',
        default: undefined,
        pattern: /^.{0,255}$/,
        require: false
      }
    ]
  };
}
