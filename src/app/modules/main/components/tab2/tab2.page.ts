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
    private store: Store<MainState>
  ) {}

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.checkGeo();
      this.initExploreBusiness();
    });
  }

  ionViewWillLeave() {
    this.clearWatch();

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async getCurrentPosition() {
    const coordinates = await Plugins.Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    console.log('getCurrentPosition: ', coordinates);

    if (coordinates) {
      this.zone.run(() => {
        this.currentCoords = coordinates.coords;
        this.mapCenter = {
          lat: coordinates.coords.latitude,
          lng: coordinates.coords.longitude,
        };

        this.mapMarker = {
          position: this.mapCenter,
          options: {
            animation: google.maps.Animation.BOUNCE,
            icon: './assets/icon/marker.png',
            draggable: false,
          },
        };
      });
    }
  }

  openInfoWindow(marker: MapMarker) {
    console.log('openInfoWindow: ', marker);
  }

  async requestGeoPermissions() {
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

              this.mapMarker = {
                position: this.mapCenter,
                options: {
                  animation: google.maps.Animation.BOUNCE,
                  icon: './assets/icon/marker.png',
                },
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
