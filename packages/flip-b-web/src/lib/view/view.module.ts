import {NgModule} from '@angular/core';
import {FlipBModule} from '../flip-b.module';
import {ViewPageRoutingModule} from './view-routing.module';
import {ViewPage} from './view.page';

@NgModule({
  declarations: [ViewPage],
  imports: [FlipBModule, ViewPageRoutingModule]
})
export class ViewPageModule {}
