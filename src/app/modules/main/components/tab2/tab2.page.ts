import {
  Component,
  ElementRef,
  ViewChild,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
import { Platform } from '@ionic/angular';
import { CallbackID, Plugins, PermissionType } from '@capacitor/core';

@Component({
  selector: 'app-tab2',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
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

  watchId: CallbackID;

  @ViewChild('map')
  public mapElement: ElementRef;

  constructor(private zone: NgZone, private platform: Platform) {}

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
}
