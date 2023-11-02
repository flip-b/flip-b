import {Pipe, PipeTransform} from '@angular/core';
import {DataService} from './data.service';

@Pipe({
  name: 'i18n'
})
export class I18nPipe implements PipeTransform {
  constructor(private data: DataService) {}

  transform(...args: any): any {
    return this.data.i18n(...args);
  }
}
