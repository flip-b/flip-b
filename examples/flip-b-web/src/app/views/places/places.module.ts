import { NgModule } from '@angular/core';
import { FlipBModule } from '@flip-b/web';
import { PlacesPageRoutingModule } from './places-routing.module';
import { PlacesPage } from './places.page';

@NgModule({
  declarations: [PlacesPage],
  entryComponents: [PlacesPage],
  imports: [FlipBModule, PlacesPageRoutingModule]
})
export class PlacesPageModule {}
