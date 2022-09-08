import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
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
   * Request
   */
  async request(params: any): Promise<any> {
    const method = this.formatMethod(params.method);
    const url = this.formatUrl(params.url);
    const uri = this.formatUri(params.uri);
    const qs = this.formatQs(params.qs);
    const body = this.formatBody(params.body);
    const form = this.formatForm(params.form);
    const headers = this.formatHeaders(params.headers);
    const observe = params.observe || undefined;
    const responseType = params.type || undefined;
    const response$ = this._httpClient.request(method, `${url}${uri}${qs}`, {body: body || form, headers, observe, responseType});
    return lastValueFrom(response$);
  }

  /**
   * Format method
   */
  private formatMethod(method: any): string {
    return `${method || 'GET'}`.toUpperCase().trim();
  }

  /**
   * Format URL
   */
  private formatUrl(url: any): string {
    return `${url || this._config.url || ''}`.trim();
  }

  /**
   * Format URI
   */
  private formatUri(uri: any): string {
    return `${uri || this._config.uri || ''}`.trim();
  }

  /**
   * Format QS
   */
  private formatQs(qs: any): string {
    return qs ? '?' + this.transformObjectToQs(qs) : '';
  }

  /**
   * Format body
   */
  private formatBody(body: any): any {
    if (typeof body !== 'object' || Object.keys(body).length === 0) {
      return undefined;
    }
    return body;
  }

  /**
   * Format form
   */
  private formatForm(body: any): any {
    if (typeof body !== 'object' || Object.keys(body).length === 0) {
      return undefined;
    }
    const form: FormData = new FormData();
    for (const i in body) {
      form.append(i, body[i]);
    }
    return form;
  }

  /**
   * Format Headers
   */
  private formatHeaders(headers: any): any {
    headers = {...(headers || {}), ...(this._config.headers || {})};
    for (const h in headers) {
      if (!headers[h]) {
        delete headers[h];
      }
    }
    return new HttpHeaders(headers);
  }

  /**
   * Transform object to QS
   */
  private transformObjectToQs(params: any, prefix: any = ''): any {
    const result = [];
    for (const p in params) {
      if (params.hasOwnProperty(p)) {
        const k = prefix ? prefix + '[' + p + ']' : p;
        const v = params[p];
        if (v !== null && v !== false && v !== undefined) {
          result.push(typeof v === 'object' ? this.transformObjectToQs(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
      }
    }
    return result.filter((v: any) => !!v).join('&');
  }
}
