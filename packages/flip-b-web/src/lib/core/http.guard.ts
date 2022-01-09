import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { HttpService } from './http.service';
import { PageService } from './page.service';

@Injectable({
  providedIn: 'root'
})
export class HttpGuard implements CanActivate {
  constructor(private httpService: HttpService, private pageService: PageService) {}

  async canActivate(next: ActivatedRouteSnapshot): Promise<boolean> {
    const auth = await this.httpService.verifyValue();
    if (!auth && !next.data['auth']?.includes('anonymous')) {
      this.pageService.gotoPage('user/signin');
    } else if (next.data['auth']?.includes((auth || {}).access || 'anonymous')) {
      return true;
    }
    return false;
  }
}
