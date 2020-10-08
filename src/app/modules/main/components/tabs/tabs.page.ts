import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  currentCoords = {
    latitude: 0,
    longitude: 0,
  };
  mapCenter: google.maps.LatLngLiteral;

  constructor(private platform: Platform) {}

  ionViewDidEnter() {
    this.getCurrentPosition();
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
