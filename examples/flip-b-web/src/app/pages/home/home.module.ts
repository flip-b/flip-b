import { NgModule } from '@angular/core';
import { FlipBModule } from '@flip-b/web';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

@NgModule({
  declarations: [HomePage],
  entryComponents: [HomePage],
  imports: [FlipBModule, HomePageRoutingModule]
})
export class HomePageModule {}
