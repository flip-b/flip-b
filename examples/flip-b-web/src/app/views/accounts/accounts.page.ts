import { Component } from '@angular/core';
import { Page } from '@flip-b/web';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss']
})
export class AccountsPage extends Page {
  options: any = {
    name: 'accounts',
    path: '/api/v1/accounts',
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
      },
      {
        name: 'phone',
        type: 'tel',
        size: '50',
        default: undefined,
        pattern: /^[0-9]{8,12}$/,
        require: false
      },
      {
        name: 'email',
        type: 'email',
        size: '50',
        default: undefined,
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        require: false
      },
      {
        name: 'address',
        type: 'address',
        size: '50',
        default: undefined,
        pattern: undefined,
        require: false
      },
      {
        name: 'website',
        type: 'url',
        size: '50',
        default: undefined,
        pattern: /^https?:\/\/.*$/,
        require: false
      }
    ]
  };
}
