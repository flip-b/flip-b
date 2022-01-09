import { Pipe, PipeTransform } from '@angular/core';
import { PageService } from '../page.service';

@Pipe({
  name: 'i18n'
})
export class I18nPipe implements PipeTransform {
  constructor(public pageService: PageService) {}

  transform(data: any, item: any = null): any {
    return this.pageService.formatI18n(data, item);
  }
}
