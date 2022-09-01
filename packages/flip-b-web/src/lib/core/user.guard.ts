import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {ContextService} from './context.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  // Definitions

  /**
   * Constructor
   */
  constructor(private _context: ContextService) {}

  /**
   * Can activate
   */
  async canActivate(next: ActivatedRouteSnapshot): Promise<boolean> {
    return (await this._context.auth(next.data['page']?.auth)) || true;
  }
}
