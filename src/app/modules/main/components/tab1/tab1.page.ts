import { Component, NgZone, ViewEncapsulation } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import cloneDeep from 'lodash-es/cloneDeep';
import isEmpty from 'lodash-es/isEmpty';
import filter from 'lodash-es/filter';
import each from 'lodash-es/each';

import { STORE_USER_LOCATION } from './../../../../shared/constants/utils';

import { LocalStorageService } from './../../../../services/local-storage.service';
import { DataLoaderService } from './../../../../services/data-loader.service';
import { MainState } from '../../stores/main.reducer';
import { businessSelector } from './../../stores/main.selector';

@Component({
  selector: 'app-tab1',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  fakeArr: any[] = [];
  menusArr: any[] = [];
  filteredMenusArr: any[] = [];

  onSearching: boolean;
  hasAddress: boolean;
  showBusinesses: boolean;
  showBusinessError: boolean;

  currentAddress: any = {};
  businessError: any = {};

  errorTitle = "We're sorry, We've run into an issue";

  constructor(
    private zone: NgZone,
    private store: Store<MainState>,
    private localStorageService: LocalStorageService,
    private dataLoader: DataLoaderService
  ) {
    this.onSearching = false;
    this.hasAddress = false;

    this.showBusinesses = false;

    this.fakeArr = Array.from({ length: 15 });
  }

  ionViewDidEnter() {
    this.onSearching = false;
    this.initAddress();

    this.dataLoader.getExploreBusinesses().then(
      () => {
        this.showBusinessError = false;
        this.initExploreBusiness();
      },
      (error: any) => {
        console.log('getExploreBusinesses: ', error.error);
        this.showBusinessError = true;
        if (error) {
          this.businessError = error.error;
        }
      }
    );
  }

  doRefresh(event) {
    this.showBusinesses = false;
    this.showBusinessError = false;

    this.dataLoader.getExploreBusinesses().then(
      () => {
        this.initExploreBusiness();

        if (event && event.target) {
          event.target.complete();
        }
      },
      (error: any) => {
        this.showBusinessError = true;
        if (error) {
          this.businessError = error.error;
        }

        if (event && event.target) {
          event.target.complete();
        }
      }
    );
  }

  onSearchInput(evt: any) {
    const searchText = evt.target.value;
    if (!isEmpty(searchText)) {
      this.onSearching = true;
      this.filteredMenusArr = filter(this.menusArr, (row: any) => {
        return row.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
      });
    } else {
      this.zone.run(() => {
        this.onSearching = false;
        setTimeout(() => {
          this.filteredMenusArr = cloneDeep(this.menusArr);
        }, 100);
      });
    }
  }

  async setLocationManually() {
    // const modal = await this.modalController.create({
    //   component: SearchLocationComponent,
    //   cssClass: 'modal-topmidscreen',
    //   id: 'search-location-modal',
    // });
    // modal.onDidDismiss().then(() => {
    //   this.initAddress();
    // });
    // return modal.present();
  }

  private initAddress() {
    const address = this.localStorageService.getItem(STORE_USER_LOCATION);
    if (address) {
      this.hasAddress = true;
      this.currentAddress = address;
    } else {
      this.hasAddress = false;
    }
  }

  private initExploreBusiness() {
    this.store
      .pipe(
        select(businessSelector),
        take(1),
        map((res) => res.businesses)
      )
      .subscribe((response) => {
        if (response) {
          this.menusArr = [];
          this.filteredMenusArr = [];
          const businesses = cloneDeep(response);
          each(businesses, (business: any) => {
            this.menusArr.push(business);
          });
          this.filteredMenusArr = cloneDeep(this.menusArr);
          this.showBusinesses = true;
          // console.log('this.filteredMenusArr: ', this.filteredMenusArr);
        }
      });
  }
}
