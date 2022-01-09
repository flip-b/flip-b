import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from './http.service';
import { PageService } from './page.service';

@Injectable()
export class Page {
  context: any;
  options: any;
  subscription: any;
  user: any;

  constructor(public activatedRoute: ActivatedRoute, public httpService: HttpService, public pageService: PageService) {}

  ionViewWillEnter() {
    const snapshot: any = this.activatedRoute.snapshot || {};
    const context: any = { ...snapshot.data };
    context.params = {
      ...(history.state || {}),
      ...(snapshot.params || {}),
      ...(snapshot.queryParams || {}),
      ...(context.params || {})
    };
    delete context.params.navigationId;

    setTimeout(() => {
      this.context = null;
    }, 0);
    setTimeout(() => {
      this.context = context;
    }, 0);

    this.subscription = this.httpService.getValueAsObservable().subscribe((result: any) => {
      if (this.user?.place?._id && this.user?.place?._id != result?.place?._id) {
        setTimeout(() => {
          this.context = null;
        }, 0);
        setTimeout(() => {
          this.context = context;
        }, 0);
      }
      this.user = result;
    });
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
