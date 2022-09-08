import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Definitions

  /**
   * Config
   */
  _config: any = {};

  /**
   * Constructor
   */
  constructor(public _httpClient: HttpClient) {}

  /**
   * Auth
   */
  async auth(auth: any): Promise<boolean> {
    return true;
    //const user: any = sessionStorage.getItem(`user`) ? JSON.parse(sessionStorage.getItem(`user`) || '{}') : false;
    //if (auth?.includes(user?.access || 'anonymous')) {
    //  return true;
    //} else {
    //  //await this.removeUser();
    //  //this.goto('user/signin');
    //  return false;
    //}
  }

  //async store(values: any = false): Promise<any> {
  //  try {
  //    if (values) {
  //      this.user = {
  //        access: values.user.access.role,
  //        access_token: values.user.access.token.split(' ').pop(),
  //        config: values.user.config,
  //        _id: values.user.access.user,
  //        ...values.user.values
  //      };
  //      sessionStorage.setItem(`user`, JSON.stringify(this.user));
  //      //for (const value in values) {
  //      //  sessionStorage.setItem(`app-${value}`, JSON.stringify(values[value]));
  //      //}
  //    } else {
  //      this.user = false;
  //      sessionStorage.removeItem(`user`);
  //      sessionStorage.clear();
  //    }
  //    //this.auth$.next(value);
  //  } catch (error) {
  //    console.error(error);
  //  }
  //  return this.user;
  //}
}
