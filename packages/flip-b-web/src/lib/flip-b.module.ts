import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { ConfigService } from './core/config.service';
import { MaskDirective } from './core/directives/mask.directive';
import { I18nPipe } from './core/pipes/i18n.pipe';
import { TextPipe } from './core/pipes/text.pipe';
import { FormComponent } from './form/form.component';
import { MapsComponent } from './maps/maps.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [MaskDirective, I18nPipe, TextPipe, FormComponent, MapsComponent, MenuComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, HttpClientModule, IonicModule],
  exports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, HttpClientModule, IonicModule, MaskDirective, I18nPipe, TextPipe, FormComponent, MapsComponent, MenuComponent]
})
export class FlipBModule {
  static forRoot(config: ConfigService): ModuleWithProviders<FlipBModule> {
    return {
      ngModule: FlipBModule,
      providers: [{ provide: ConfigService, useValue: config }]
    };
  }
}
