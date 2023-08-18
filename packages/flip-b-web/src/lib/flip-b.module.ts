import {NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {IonicModule} from '@ionic/angular';

import {I18nPipe} from './core/i18n.pipe';
import {FormComponent} from './form/form.component';
import {MenuComponent} from './menu/menu.component';

import {formatConfig} from './core/data.config';

@NgModule({
  declarations: [I18nPipe, FormComponent, MenuComponent],
  imports: [CommonModule, RouterModule, HttpClientModule, IonicModule],
  exports: [CommonModule, RouterModule, HttpClientModule, IonicModule, I18nPipe, FormComponent, MenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FlipBModule {
  static forRoot(flipb: any): ModuleWithProviders<FlipBModule> {
    return {ngModule: FlipBModule, providers: [{provide: 'config', useValue: formatConfig(flipb)}]};
  }
}
