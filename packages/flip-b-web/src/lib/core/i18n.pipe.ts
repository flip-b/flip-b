import {Pipe, PipeTransform} from '@angular/core';
import {DataService} from './data.service';

@Pipe({
  name: 'i18n'
})
export class I18nPipe implements PipeTransform {
  // Definitions

  /**
   * Constructor
   */
  constructor(private data: DataService) {}

  /**
   * Transform
   */
  transform(data: any, item: any = null): any {
    return this.data.i18n.format(data, item);
  }
}
