import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export abstract class BaseService {
  constructor(private http: HttpClient) {}

  protected getAPIBase(route: string = ''): string {
    return environment.baseUrl + route;
  }

  protected commonStateChangeHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }

  protected get(route: string): Observable<any> {
    const url = this.getAPIBase() + route;
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    const options = { headers };
    return this.http.get(url, options);
  }

  protected getParams(route: string, params: any): Observable<any> {
    const url = this.getAPIBase() + route;
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    const options = { headers, params };
    return this.http.get(url, options);
  }

  protected post(route: string, object?: any): Observable<any> {
    return this.http.post(this.getAPIBase(route), object, {
      headers: this.commonStateChangeHeaders(),
    });
  }

  protected postToParams(route: string): Observable<any> {
    return this.http.post(
      this.getAPIBase(route),
      {},
      { headers: this.commonStateChangeHeaders() }
    );
  }

  protected upload(route: string, object: any): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    headers.set('Content-Type', 'multipart/form-data');

    return this.http.post(this.getAPIBase(route), object, {
      headers,
      reportProgress: true,
      observe: 'events',
    });
  }

  protected delete(route: string, object?: any): Observable<any> {
    return this.http.delete(this.getAPIBase(route), {
      headers: this.commonStateChangeHeaders(),
      ...object,
    });
  }

  protected put(route: string, object: any): Observable<any> {
    return this.http.put(this.getAPIBase(route), object, {
      headers: this.commonStateChangeHeaders(),
    });
  }

  protected patch(route: string, object: any): Observable<any> {
    return this.http.patch(this.getAPIBase(route), object, {
      headers: this.commonStateChangeHeaders(),
    });
  }

  public handleError = (error: any) => {};
}
