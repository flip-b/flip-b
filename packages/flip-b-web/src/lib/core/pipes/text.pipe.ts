import { Pipe, PipeTransform } from '@angular/core';
import { PageService } from '../page.service';

@Pipe({
  name: 'text'
})
export class TextPipe implements PipeTransform {
  constructor(public pageService: PageService) {}

  transform(data: any, type: any = null): any {
    return this.pageService.formatText(data, type);
  }
}
