import {
  Component,
  ElementRef,
  ViewChild,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
import { Platform } from '@ionic/angular';
import { CallbackID, Plugins, PermissionType } from '@capacitor/core';
import { select, Store } from '@ngrx/store';
import { MainState } from '../../stores/main.reducer';
import { businessSelector } from '../../stores/main.selector';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import cloneDeep from 'lodash-es/cloneDeep';
import each from 'lodash-es/each';
import { MapMarker } from '@angular/google-maps';

import { LocalStorageService } from './../../../../services/local-storage.service';
import { DataLoaderService } from './../../../../services/data-loader.service';

import {
  STORE_USER_LOCATION,
  STORE_RADIUS_SEARCH,
} from './../../../../shared/constants/utils';

@Component({
  selector: 'app-tab2',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  menusArr: any[] = [];
  filteredMenusArr: any[] = [];

  watchCoords = {
    latitude: 0,
    longitude: 0,
  };

  currentCoords = {
    latitude: 0,
    longitude: 0,
  };

  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoom: 16,
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,

    // maxZoom: 15,
    // minZoom: 8,
  };
  mapCircleOptions: google.maps.CircleOptions = {
    strokeColor: '#b9271a',
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillColor: '#b9271a',
    fillOpacity: 0.25,
  };

  mapCenter: google.maps.LatLngLiteral;
  mapMarker: any;
  mapRadius = 500;
  radius = 5;
  markerOptions: google.maps.MarkerOptions = {
    animation: google.maps.Animation.DROP,
    icon: './assets/icon/store.png',
    draggable: false,
  };
  businessMarkers: google.maps.LatLngLiteral[] = [];

  watchId: CallbackID;

  @ViewChild('map')
  public mapElement: ElementRef;

  unsubscribe$ = new Subject<any>();

  constructor(
    private zone: NgZone,
    private platform: Platform,
    private store: Store<MainState>,
    private dataLoader: DataLoaderService,
    private localStorageService: LocalStorageService
  ) {}

  ionViewDidEnter() {
    this.initAddress();
  }

  ionViewWillLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openInfoWindow(marker: MapMarker) {
    console.log('openInfoWindow: ', marker);
  }

  private initAddress(event?: any) {
    const radius = this.localStorageService.getItem(STORE_RADIUS_SEARCH);
    const address = this.localStorageService.getItem(STORE_USER_LOCATION);
    if (address) {
      const coords = address.location;
      console.log('coords: ', coords);

      this.radius = radius;
      this.currentCoords = coords;
      this.mapCenter = {
        lat: coords.lat,
        lng: coords.lng,
      };

      this.mapMarker = {
        position: this.mapCenter,
        options: {
          animation: google.maps.Animation.BOUNCE,
          icon: './assets/icon/marker.png',
          draggable: false,
        },
      };

      this.fetchBusinesses(
        {
          latitude: coords.lat,
          longitude: coords.lng,
          radius: this.radius,
        },
        event
      );
    } else {
      this.fetchBusinesses({}, event);
    }
  }

  private fetchBusinesses(params?: any, event?: any) {
    this.dataLoader.getExploreBusinesses(params).then(
      () => {
        this.initExploreBusiness();

        if (event && event.target) {
          event.target.complete();
        }
      },
      (error: any) => {
        console.log('getExploreBusinesses: ', error.error);
        if (event && event.target) {
          event.target.complete();
        }
      }
    );
  }

  private initExploreBusiness() {
    this.store
      .pipe(
        select(businessSelector),
        takeUntil(this.unsubscribe$),
        map((res) => res.businesses)
      )
      .subscribe((response) => {
        if (response) {
          this.menusArr = [];
          this.filteredMenusArr = [];
          const businesses = cloneDeep(response);
          each(businesses, (business: any) => {
            this.businessMarkers.push(business.location);
            this.menusArr.push(business);
          });
          this.filteredMenusArr = cloneDeep(this.menusArr);
          console.log('filteredMenusArr: ', this.filteredMenusArr);
        }
      });
  }
}
