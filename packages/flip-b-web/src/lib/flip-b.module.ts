import {NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {IonicModule} from '@ionic/angular';
import {I18nDirective} from './core/i18n.directive';
import {I18nPipe} from './core/i18n.pipe';
import {FormComponent} from './form/form.component';
import {ItemComponent} from './item/item.component';
import {ItemDatetimeComponent} from './item-datetime/item-datetime.component';
import {ItemLocationComponent} from './item-location/item-location.component';
import {ItemSelectComponent} from './item-select/item-select.component';
import {ListComponent} from './list/list.component';
import {MenuComponent} from './menu/menu.component';
import {PageComponent} from './page/page.component';

@NgModule({
  declarations: [I18nDirective, I18nPipe, FormComponent, ItemComponent, ItemDatetimeComponent, ItemLocationComponent, ItemSelectComponent, ListComponent, MenuComponent, PageComponent],
  imports: [CommonModule, RouterModule, HttpClientModule, IonicModule],
  exports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    IonicModule,
    I18nDirective,
    I18nPipe,
    FormComponent,
    ItemComponent,
    ItemDatetimeComponent,
    ItemLocationComponent,
    ItemSelectComponent,
    ListComponent,
    MenuComponent,
    PageComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FlipBModule {
  static forRoot(flipb: any): ModuleWithProviders<FlipBModule> {
    return {ngModule: FlipBModule, providers: [{provide: 'config', useValue: flipb}]};
  }
}
