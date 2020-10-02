import {
  Component,
  OnInit,
  ViewEncapsulation,
  NgZone,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  ModalController,
  Platform,
  LoadingController,
} from '@ionic/angular';
import { CallbackID, Plugins, PermissionType } from '@capacitor/core';

import { PlaceSearchService } from '../../../services/place.search.service';
import { LocalStorageService } from './../../../services/local-storage.service';
import { STORE_USER_LOCATION } from './../../constants/utils';

declare const google: any;

@Component({
  selector: 'app-map-component',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss'],
})
export class MapComponentComponent implements OnInit {
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
  mapCenter: google.maps.LatLngLiteral;
  mapMarker: any;

  watchId: CallbackID;

  @ViewChild('map')
  public mapElement: ElementRef;

  constructor(
    private zone: NgZone,
    public platform: Platform,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private placeSearchService: PlaceSearchService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {}

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.checkGeo();
    });
  }

  ionViewWillLeave() {
    this.clearWatch();
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
          },
        };
      });
    }
  }

  async setCurrentLocation() {
    console.log('setCurrentLocation: ', this.currentCoords);

    const loading = await this.loadingController.create();
    loading.present();
    this.placeSearchService
      .getLocationByLatLng(
        this.currentCoords.latitude,
        this.currentCoords.longitude
      )
      .then(
        (result: any) => {
          console.log('getLocationByLatLng result: ', result);
          loading.dismiss();
          const place = {
            place_id: result.place_id,
            address: result.formatted_address,
            description: result.formatted_address,
            title: result.formatted_address,
            subtitle: result.formatted_address,
            location: result.location,
          };
          this.localStorageService.setItem(STORE_USER_LOCATION, place);
        },
        () => {
          loading.dismiss();
        }
      )
      .then(() => {
        this.modalController.dismiss(this.currentCoords);
      });
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

  async requestGeoPermissions() {
    setTimeout(() => {
      this.getCurrentPosition();
      this.watchPosition();
    }, 300);
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

  dismiss() {
    this.clearWatch();
    this.modalController.dismiss();
  }
}
