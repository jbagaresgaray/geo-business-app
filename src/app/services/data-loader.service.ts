import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MainService } from '../modules/main/services/main.service';

import { ExploreBusinessAction } from '../modules/main/stores/main.actions';
import { MainState } from '../modules/main/stores/main.reducer';

@Injectable({
  providedIn: 'root',
})
export class DataLoaderService {
  constructor(
    private mainService: MainService,
    private store: Store<MainState>
  ) {}

  getExploreBusinesses(params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mainService.getExploreBusinesses(params).subscribe(
        (response: any) => {
          if (response) {
            const business = response.result;
            this.store.dispatch(
              new ExploreBusinessAction({ businesses: business })
            );
          }
          return resolve(true);
        },
        (error) => {
          return reject(error);
        }
      );
    });
  }
}
