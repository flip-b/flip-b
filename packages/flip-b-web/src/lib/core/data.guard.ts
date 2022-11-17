import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class DataGuard implements CanActivate {
  // Definitions

  /**
   * Constructor
   */
  constructor(private data: DataService) {}

  /**
   * Can activate
   */
  async canActivate(next: ActivatedRouteSnapshot): Promise<boolean> {
    return await this.data.auth(next.data.path);
  }
}
