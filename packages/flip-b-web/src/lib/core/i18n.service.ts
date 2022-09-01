import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  // Definitions

  /**
   * Config
   * @attribute {Object}
   */
  config: any = {};

  /**
   * Constructor
   */
  constructor() {
    this.onInit();
  }

  /**
   * Init event handler
   */
  async onInit(): Promise<any> {
  }

  /**
   * Get locale
   */
  getLocale(): any {
    return 'es-AR-u-hc-h23';
  }

  /**
   * Format I18n
   */
  format(data: any, item: any = null): any {
    const parts = `${data || ''}`.toLowerCase().split('.');
    const index = parts.shift();
    const count = parts.length;
    const tests = [`${index}`, '$page', '$text'];
    let result = '';
    for (let i = 0; i < count; i++) {
      const value = parts.join('.');
      parts.shift();
      for (const t of tests) {
        if (this.config.values && this.config.values[`${t}`] && this.config.values[`${t}`][`${value}[${this.config.region}]`]) {
          result = this.config.values[`${t}`][`${value}[${this.config.region}]`];
          break;
        }
        if (this.config.values && this.config.values[`${t}`] && this.config.values[`${t}`][`${value}`]) {
          result = this.config.values[`${t}`][`${value}`];
          break;
        }
      }
      if (result) {
        break;
      }
    }
    result = result.toString();
    result = result.replace(/\s\s+/, ' ').trim();
    if (item) {
      for (const i in item) {
        result = result.replace(`{{${i}}}`, item[i]);
      }
    }
    result = result.replace(/\{\{.*?\}\}/, '').trim();
    result = result.replace(/\s\s+/, ' ').trim();
    return result;
  }

  //  /**
  //   *
  //   *
  //   * Description            Format                  Datetime Value Example
  //   *
  //   * Year                   YYYY                    1994
  //   * Year and Month         YYYY-MM                 1994-12
  //   * Date                   YYYY-MM-DD              1994-12-15
  //   * Date and Time          YYYY-MM-DDTHH:mm        1994-12-15T13:47
  //   * UTC Date               YYYY-MM-DDTHH:mm:ssZ    1994-12-15T13:47:20Z
  //   * GMT Date               YYYY-MM-DDTHH:mm:ssTZD  1994-12-15T13:47:20+05:00
  //   * Hour and Minute        HH:mm                   13:47
  //   * Hour, Minute, Second   HH:mm:ss                13:47:20
  //   */
  //
  //  /**
  //   * Change Title Case
  //   *
  //   * Transform a string into title case.
  //   *
  //   * data.titleCase("STRING"); // "String"
  //   * data.titleCase("follow step-by-step instructions"); // "Follow Step-by-step Instructions"
  //   */
  //  changeTitleCase(input: string): string {
  //    let words: any = input.toLowerCase().split(' ');
  //    for (let i = 0; i < words.length; i++) {
  //      words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
  //    }
  //    return words.join(' ');
  //  }
  //
  //  // // Format value
  //  // if (result.options?.format === 'object') {
  //  //   result.value = this.getObject(result.value) || undefined;
  //  // } else if (result.options?.format === 'string') {
  //  //   result.value = this.getString(result.value) || undefined;
  //  // } else if (result.options?.format === 'number') {
  //  //   result.value = this.getNumber(result.value) || 0;
  //  // } else if (result.options?.format === 'date') {
  //  //   result.value = this.getDate(result.value) || undefined;
  //  // } else if (result.options?.format === 'boolean') {
  //  //   result.value = this.getBool(result.value) || undefined;
  //  // }

  /**
   * Get object
   */
  getObject(value: any): any {
    const result = value || {};
    return result;
  }

  /**
   * Get string
   */
  getString(value: any): any {
    let result = value || '';
    result = result.toString();
    return result;
  }

  /**
   * Get number
   */
  getNumber(value: any): any {
    let result = value || 0;
    result = parseFloat(result);
    return result;
  }

  /**
   * Get number positive
   */
  getNumberPositive(value: any): any {
    let result = value || 0;
    result = this.getNumber(result);
    result = Math.abs(result);
    return result;
  }

  /**
   * Get number negative
   */
  getNumberNegative(value: any): any {
    let result = value || 0;
    result = this.getNumber(result);
    result = Math.abs(result) * -1;
    return result;
  }

  /**
   * Get date
   */
  getDate(value: any): string {
    if (!value) {
      return '';
    }
    const p = (n: any) => {
      const v = Math.floor(Math.abs(n));
      return (v < 10 ? '0' : '') + v;
    };
    const date = new Date(value);
    const t = date.getTimezoneOffset() * -1;
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const i = date.getMinutes();
    const s = date.getSeconds();
    return `${y}-${p(m)}-${p(d)}T${p(h)}:${p(i)}:${p(s)}${t >= 0 ? '+' : '-'}${p(t / 60)}:${p(t % 60)}`;
  }

  /**
   * Get bool
   */
  getBool(value: any): string {
    let result = value || false;
    result = ['true', 'yes', '1', true].includes(value) ? true : false;
    return result;
  }

  /**
   * Format I18n
   */
  getI18n(value: any, type: any = null, item: any = null): any {
    let result = value;
    if (!type) {
      result = this.format(value, item);
    }
    //if (!type) {
    //  result = this.format(value, item);
    //} else if (type === 'id') {
    //} else if (type === 'object') {
    //} else if (type === 'select') {
    //} else if (type === 'select_multiple') {
    //
    //} else if (type === 'text') {
    //} else if (type === 'textarea') {
    //} else if (type === 'richtext') {
    //
    //} else if (type === 'toggle' || type === 'checkbox') {
    //
    //  result = this.format(value ? '$page.yes.title' : '$page.no.title');
    //
    //} else if (type === 'unixtime') {
    //  result = this.getDisplayDatetime(result);
    //} else if (type === 'datetime') {
    //  result = this.getDisplayDatetime(result);
    //} else if (type === 'date') {
    //  result = this.getDisplayDate(result);
    //} else if (type === 'time') {
    //  result = this.getDisplayTime(result);
    //} else if (type === 'year') {
    //  result = this.getDisplayYear(result);
    //} else if (type === 'year_month') {
    //  result = this.getDisplayYearMonth(result);
    //
    //} else if (type === 'decimal') {
    //  result = this.getDisplayNumber(result);
    //} else if (type === 'integer') {
    //  result = this.getDisplayNumber(result).split(',').shift();
    //} else if (type === 'percent') {
    //  result = this.getDisplayNumber(result) + '%';
    //} else if (type === 'currency') {
    //  result = '$' + this.getDisplayNumber(result);
    //
    //} else if (type === 'url') {
    //  result = this.getDisplayUrl(result);
    //} else if (type === 'phone') {
    //  result = this.getDisplayPhone(result);
    //} else if (type === 'email') {
    //  result = this.getDisplayEmail(result);
    //} else if (type === 'color') {
    //  result = this.getDisplayColor(result);
    //
    //} else if (type === 'location') {
    //  result = this.getDisplayLocation(result);
    //}
    //
    //if (typeof result === 'string') {
    //  result = result.replace(/\s\s+/, ' ').trim();
    //}
    return result;
  }

  //  /**
  //   * Format string
  //   */
  //  getDisplayString(value: any): any {
  //    let result = value || '';
  //    return result;
  //  }
  //
  //  /**
  //   * Format number
  //   */
  //  getDisplayNumber(value: any): any {
  //    let result = this.getNumber(value);
  //    result = Math.round((result + Number.EPSILON) * 100) / 100;
  //    const values = result.toString().split('.');
  //    result = values[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + ((values[1] ? values[1].substr(0, 2) : '') + '00').substr(0, 2);
  //    result = result.trim();
  //    return result;
  //  }
  //
  //  /**
  //   * Format datetime
  //   */
  //  getDisplayDatetime(value: any): any {
  //    let result = value ? this.getDate(value) : '';
  //    result = result.toString();
  //    result = result.replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2}).([0-9]{2}):([0-9]{2}):([0-9]{2})(.*)?/, (...v: any) => {
  //      return 'd/m/y h:i:s'.trim().replace(/y+/i, v[1]).replace(/m+/i, v[2]).replace(/d+/i, v[3]).replace(/h+/i, v[4]).replace(/i+/i, v[5]).replace(/s+/i, v[6]);
  //    });
  //    return result;
  //  }
  //
  //  /**
  //   * Format date
  //   */
  //  getDisplayDate(value: any): any {
  //    let result = value || '';
  //    result = result.toString();
  //    result = result.replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})(.*)/, (...v: any) => {
  //      return 'd/m/y'.trim().replace(/y+/i, v[1]).replace(/m+/i, v[2]).replace(/d+/i, v[3]);
  //    });
  //    return result;
  //  }
  //
  //  /**
  //   * Format time
  //   */
  //  getDisplayTime(value: any): any {
  //    let result = value || '';
  //    result = result.toString();
  //    result = result.replace(/([0-9]{2}):([0-9]{2}):([0-9]{2})(.*)/, (...v: any) => {
  //      return 'h:i:s'.trim().replace(/h+/i, v[1]).replace(/i+/i, v[2]).replace(/s+/i, v[3]);
  //    });
  //    return result;
  //  }
  //
  //  /**
  //   * Format year
  //   */
  //  getDisplayYear(value: any): any {
  //    let result = value || '';
  //    result = result.toString();
  //    result = result.replace(/^([0-9]{4})$/, '$1');
  //    return result;
  //  }
  //
  //  /**
  //   * Format year-month
  //   */
  //  getDisplayYearMonth(value: any): any {
  //    let result = value || '';
  //    result = result.toString();
  //    result = result.replace(/^([0-9]{4})-([0-9]{2})$/, '$2/$1');
  //    return result;
  //  }
  //
  //  /**
  //   * Format URL
  //   */
  //  getDisplayUrl(value: any): any {
  //    let result = value || '';
  //    result = result.toString();
  //    result = result.toLowerCase();
  //    result = result.trim();
  //    return result;
  //  }
  //
  //  /**
  //   * Format phone
  //   */
  //  getDisplayPhone(value: any): any {
  //    let result = value || '';
  //    result = result.toString();
  //    result = result.toLowerCase();
  //    result = result.trim();
  //    return result;
  //  }
  //
  //  /**
  //   * Format email
  //   */
  //  getDisplayEmail(value: any): any {
  //    let result = value || '';
  //    result = result.toString();
  //    result = result.toLowerCase();
  //    result = result.trim();
  //    return result;
  //  }
  //
  //  /**
  //   * Format color
  //   */
  //  getDisplayColor(value: any): any {
  //    let result = value || '';
  //    result = result.toString();
  //    result = result.toLowerCase();
  //    result = result.trim();
  //    return result;
  //  }
  //
  //  /**
  //   * Format location
  //   */
  //  getDisplayLocation(value: any): any {
  //    if (typeof value == 'object' && value) {
  //      value = [value.street, value.city, value.state].filter((v) => !!v).join(', ');
  //    }
  //    let result = value || '';
  //    result = result.toString();
  //    result = result.trim();
  //    return result;
  //  }

  /**
   * Format address text
   */
  formatString(value: any): string {
    let result = value || '';
    result = result.toString();
    result = result.replace(/\s\s+/, ' ').trim();
    result = result
      .split(' ')
      .map((word: string) => {
        if (word.match(/[0-9]+/)) {
          return word.toUpperCase();
        }
        if (word.match(/[^a-záéíóúñ]/)) {
          return word;
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
      })
      .join(' ');
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
  }
}
