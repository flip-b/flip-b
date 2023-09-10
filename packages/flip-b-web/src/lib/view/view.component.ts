import {Component} from '@angular/core';
import {FlipBModule} from '../flip-b.module';

@Component({
  standalone: true,
  selector: 'flb-view',
  templateUrl: './view.component.html',
  imports: [FlipBModule]
})
export class ViewComponent {}
