import { Component, NgZone, ViewEncapsulation } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import cloneDeep from 'lodash-es/cloneDeep';
import isEmpty from 'lodash-es/isEmpty';
import filter from 'lodash-es/filter';
import each from 'lodash-es/each';
import { ModalController, Platform } from '@ionic/angular';

import { CallbackID, PermissionType, Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

import { STORE_USER_LOCATION } from './../../../../shared/constants/utils';

import { LocalStorageService } from './../../../../services/local-storage.service';
import { DataLoaderService } from './../../../../services/data-loader.service';
import { MainState } from '../../stores/main.reducer';
import { businessSelector } from './../../stores/main.selector';

import { SearchLocationComponent } from './../../../../shared/components/search-location/search-location.component';

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
  currentCoords = {
    latitude: 0,
    longitude: 0,
  };
  watchCoords = {
    latitude: 0,
    longitude: 0,
  };
  mapCenter: google.maps.LatLngLiteral;
  watchId: CallbackID;

  errorTitle = "We're sorry, We've run into an issue";

  constructor(
    private zone: NgZone,
    private platform: Platform,
    private store: Store<MainState>,
    private modalController: ModalController,
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
    this.checkGeo();
    this.initAddress();

    this.fetchBusinesses();
  }

  ionViewWillLeave() {
    this.clearWatch();
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
    const modal = await this.modalController.create({
      component: SearchLocationComponent,
      cssClass: 'modal-topmidscreen',
      id: 'search-location-modal',
    });
    modal.onDidDismiss().then(() => {
      this.initAddress();
    });
    return modal.present();
  }

  private fetchBusinesses() {
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

  private async checkGeo() {
    const has: any = await Plugins.Permissions.query({
      name: PermissionType.Geolocation,
    });
    console.log('Geo has: ', has);
    if (has.state && (has.state === 'prompt' || has.state === 'denied')) {
      this.requestGeoPermissions();
    } else if (has.state && has.state === 'granted') {
      this.getCurrentPosition();
      this.watchPosition();
    }
  }

  private async requestGeoPermissions() {
    setTimeout(() => {
      this.getCurrentPosition();
      this.watchPosition();
    }, 300);
  }

  private watchPosition() {
    try {
      this.watchId = Plugins.Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
        },
        (position, err) => {
          if (position) {
            console.log('watchPosition: ', position);
            this.zone.run(() => {
              this.watchCoords = position.coords;
              this.currentCoords = position.coords;
              this.mapCenter = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
            });
          }
        }
      );
    } catch (e) {
      alert('WebView geo error');
      console.error(e);
    }
  }

  private clearWatch() {
    if (this.watchId != null) {
      Plugins.Geolocation.clearWatch({ id: this.watchId });
    }
  }

  private async getCurrentPosition() {
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      console.log('getCurrentPosition: ', coordinates);
      if (coordinates) {
        this.currentCoords = coordinates.coords;
        this.mapCenter = {
          lat: coordinates.coords.latitude,
          lng: coordinates.coords.longitude,
        };
      }
    } else {
      const success = (pos) => {
        if (pos) {
          const crd = pos.coords;
          console.log('getCurrentPosition: ', crd);

          this.currentCoords = crd;
          this.mapCenter = {
            lat: crd.latitude,
            lng: crd.longitude,
          };
        }
      };

      const error = (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      };

      navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
      });
    }
  }
}
