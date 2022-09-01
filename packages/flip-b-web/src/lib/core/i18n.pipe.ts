import {Pipe, PipeTransform} from '@angular/core';
import {ContextService} from './context.service';

@Pipe({
  name: 'i18n'
})
export class I18nPipe implements PipeTransform {
  // Definitions

  /**
   * Constructor
   */
  constructor(public _context: ContextService) {}

  /**
   * Transform
   */
  transform(data: any, item: any = null): any {
    return this._context.i18n.format(data, item);
  }
}
