import { NgModule } from '@angular/core';
import { FlipBModule } from '@flip-b/web';
import { ProductsPageRoutingModule } from './products-routing.module';
import { ProductsPage } from './products.page';

@NgModule({
  declarations: [ProductsPage],
  entryComponents: [ProductsPage],
  imports: [FlipBModule, ProductsPageRoutingModule]
})
export class ProductsPageModule {}
