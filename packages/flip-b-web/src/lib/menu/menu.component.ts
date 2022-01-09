import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpService } from '../core/http.service';
import { PageService } from '../core/page.service';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'flb-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  constructor(public modalController: ModalController, public httpService: HttpService, public pageService: PageService) {}

  ngOnInit(): void {}

  async showForm(params: any): Promise<any> {
    const modal = await this.modalController.create({
      cssClass: 'view',
      component: FormComponent,
      componentProps: params
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    if (result && result.data) {
      if (params.data && params.data.where) {
        params.data.where[params.name] = result.data._id || undefined;
      }
      if (params.data && params.data.names) {
        params.data.names[params.name] = result.data.name || undefined;
      }
      return result.data;
    } else {
      if (params.data && params.data.where) {
        params.data.where[params.name] = undefined;
      }
      if (params.data && params.data.names) {
        params.data.names[params.name] = undefined;
      }
      return null;
    }
  }

  async showUserPlaceSelector(): Promise<any> {
    let profile = await this.httpService.update('/api/v1/users/profile');
    if (profile && profile.accounts?.length != 1) {
      const result = await this.showForm({
        context: { view: 'search' },
        options: {
          name: 'accounts',
          path: '/api/v1/accounts',
          onSelect: 'return'
        }
      });
      if (!result?._id) {
        return profile;
      }
      profile = await this.httpService.update('/api/v1/users/profile', {
        account: result._id
      });
    }
    if (profile && profile.places?.length != 1) {
      const result = await this.showForm({
        context: { view: 'search' },
        options: { name: 'places', path: '/api/v1/places', onSelect: 'return' }
      });
      if (!result?._id) {
        return profile;
      }
      profile = await this.httpService.update('/api/v1/users/profile', {
        place: result._id
      });
    }
    return profile;
  }
}
