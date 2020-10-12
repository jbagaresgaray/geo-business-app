import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../services/base.service';

@Injectable({
  providedIn: 'root',
})
export class MainService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  getExploreBusinesses(params: any): Observable<any> {
    console.log('getExploreBusinesses: ', params);
    return this.getParams('/business', { ...params });
  }
}
