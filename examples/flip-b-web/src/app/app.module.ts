import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FlipBModule } from '@flip-b/web';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { config } from './config';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ServiceWorkerModule.register('ngsw-worker.js', config.worker), FlipBModule.forRoot({ values: config }), IonicModule.forRoot(config.ionic), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule {}
