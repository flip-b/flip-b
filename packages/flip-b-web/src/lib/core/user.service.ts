import {Injectable, EventEmitter} from '@angular/core';

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
   * Events
   */
  _events: any = new EventEmitter<any>();

  /**
   * Constructor
   */
  constructor() {
    this._config.storage = localStorage || sessionStorage;
    this._config.history = [];
    this.getUser();
  }

  /**
   * Auth
   */
  async auth(user?: any): Promise<boolean> {
    if (user) {
      await this.setUser(user);
      this._events.emit({name: 'auth', data: user});  
    }
    return user;
  }

  /**
   * Get user
   */
  async getUser(): Promise<any> {
    try {
      return this._config.storage.getItem(`user`) ? JSON.parse(this._config.storage.getItem(`user`) || '{}') : false;
    } catch (error: any) {
      console.log(`UserService.setUser error ${error}`);
    }
  }
  
  /**
   * Set user
   */
  async setUser(user: any): Promise<any> {
    try {
      this._config.storage.setItem(`user`, JSON.stringify(user))
    } catch (error: any) {
      console.log(`UserService.setUser error ${error}`);
    }
  }
 
  /**
   * Remove
   */
  async remove(): Promise<any> {
    sessionStorage.removeItem(`user`);
    sessionStorage.clear();
  }
}
