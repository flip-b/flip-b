import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HttpGuard } from '@flip-b/web';

import { config } from './config';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home'
  }
];

for (const page of config.pages) {
  for (const route of page.routes) {
    routes.push({
      path: route.path,
      data: route,
      loadChildren: page.module,
      canActivate: [HttpGuard]
    });
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
