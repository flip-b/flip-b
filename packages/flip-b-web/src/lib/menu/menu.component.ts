import {Component} from '@angular/core';
import {DataService} from '../core/data.service';

@Component({
  selector: 'flb-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent {
  constructor(public data: DataService) {}
}
