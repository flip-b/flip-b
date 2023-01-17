import {NgModule, ModuleWithProviders} from '@angular/core';
import {RouterModule, PreloadAllModules} from '@angular/router';
import {formatConfig} from './core/data.events';

@NgModule({
  imports: [RouterModule.forRoot([], {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class FlipBRouterModule extends RouterModule {
  static forRoot(flipb: any): ModuleWithProviders<FlipBRouterModule> {
    return super.forRoot(formatConfig(flipb).routes);
  }
}
