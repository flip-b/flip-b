import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class DataGuard implements CanActivate {
  constructor(private data: DataService) {}

  canActivate(next: ActivatedRouteSnapshot): boolean {
    return this.data.auth(next.data.path);
  }
}
