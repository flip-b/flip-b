import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private config: any;
  private auth: BehaviorSubject<any> = new BehaviorSubject(null);
  private authK: string;
  private authV: any;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.config = configService.values;
    this.authK = `${this.config.name}AuthValue`;
  }

  /**
   * Auth methods
   */

  async verifyValue(): Promise<any> {
    const result = sessionStorage.getItem(this.authK) ? JSON.parse(sessionStorage.getItem(this.authK) || '') : false;
    this.auth.next(result);
    this.authV = result;
    return result;
  }

  async updateValue(value: any): Promise<any> {
    sessionStorage.setItem(this.authK, value ? JSON.stringify(value) : '');
    this.auth.next(value);
    this.authV = value;
  }

  async removeValue(): Promise<any> {
    sessionStorage.setItem(this.authK, '');
    this.auth.next(false);
    this.authV = null;
  }

  async update(action: string, params?: any): Promise<any> {
    const result = await this.post(action, params);
    if (result && result._id && result.token) {
      await this.updateValue(result);
    } else {
      await this.removeValue();
    }
    return result;
  }

  getValueAsObservable(): Observable<any> {
    return this.auth.asObservable();
  }

  /**
   * HTTP restful methods
   */

  get(uri: string, qs: any = null): Promise<any> {
    return this.request({
      method: 'GET',
      uri: uri,
      qs: qs
    });
  }

  put(uri: string, body: any = {}): Promise<any> {
    return this.request({
      method: 'PUT',
      uri: uri,
      body: body
    });
  }

  post(uri: string, body: any = {}): Promise<any> {
    return this.request({
      method: 'POST',
      uri: uri,
      body: body
    });
  }

  delete(uri: string): Promise<any> {
    return this.request({
      method: 'DELETE',
      uri: uri
    });
  }

  /**
   * HTTP request methods
   */

  async request(params: any): Promise<any> {
    const method = this.formatMethod(params.method);
    const url = this.formatUri(params.url || this.config.url);
    const uri = this.formatUri(params.uri);
    const qs = this.formatQs(params.qs);
    const body = this.formatBody(params.body);
    const headers = this.formatHeaders(params.headers);

    const result: any = await this.httpClient
      .request(method, `${url}/${uri}${qs}`, {
        body: body,
        headers: new HttpHeaders(headers),
        responseType: params.responseType || undefined
      })
      .toPromise();

    if (result && result.token) {
      await this.updateValue(result);
    }

    return result;
  }

  async requestReportProgress(params: any): Promise<any> {
    const method = this.formatMethod(params.method);
    const url = this.formatUri(params.url || this.config.url);
    const uri = this.formatUri(params.uri);
    const qs = this.formatQs(params.qs);
    const body = this.formatBody(params.body);
    const headers = this.formatHeaders(params.headers);

    return new Promise((resolve) => {
      this.httpClient
        .request(method, `${url}/${uri}${qs}`, {
          body: body,
          headers: new HttpHeaders(headers),
          observe: 'events',
          reportProgress: true
        })
        .subscribe((event: any) => {
          if (event.type == HttpEventType.Sent) {
            console.log('upload file progress', 0);
          }
          if (event.type == HttpEventType.UploadProgress) {
            const progress = Math.round((100 * event.loaded) / event.total);
            console.log('upload file progress', progress);
          }
          if (event.type == HttpEventType.Response) {
            console.log('upload file progress', 100, event.body);
            resolve({ data: event.body || null });
          }
        });
    });
  }

  /**
   * HTTP private methods
   */

  private formatMethod(method: any): string {
    return method || 'GET';
  }

  private formatUri(uri: any): string {
    return (uri || '').trim().replace(/^\//, '').replace(/\/$/, '');
  }

  private formatQs(qs: any): string {
    return qs ? '?' + this.formatObjectToQs(qs) : '';
  }

  private formatBody(body: any): any {
    return body;
  }

  private formatHeaders(headers: any): any {
    headers = headers || {};
    for (const h in headers) {
      if (!headers[h]) {
        delete headers[h];
      }
    }
    if (this.authV?.token) {
      headers['authorization'] = `Bearer ${this.authV.token}`;
    }
    return headers;
  }

  private formatObjectToQs(params: any, prefix: any = ''): any {
    const result = [];
    for (const p in params) {
      if (params.hasOwnProperty(p)) {
        const k = prefix ? prefix + '[' + p + ']' : p;
        const v = params[p];
        if (v === undefined) {
          continue;
        }
        result.push(v !== null && v !== false && typeof v === 'object' ? this.formatObjectToQs(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
      }
    }
    return result.join('&');
  }
}
