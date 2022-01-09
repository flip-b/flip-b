import { Injectable, Optional } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  values: any = {};

  constructor(@Optional() config?: ConfigService) {
    if (config) {
      this.values = config.values;
    }
  }
}
