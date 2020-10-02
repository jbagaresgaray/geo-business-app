import { Injectable, NgZone } from '@angular/core';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class PlaceSearchService {
  herePlatform: any;
  private GoogleAutocomplete: google.maps.places.AutocompleteService;

  constructor(private zone: NgZone) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
  }

  async searchGooglePlaces(searchText: any, origin: any) {
    return new Promise((resolve, reject) => {
      this.GoogleAutocomplete.getPlacePredictions(
        { input: searchText, origin },
        (predictions, status) => {
          this.zone.run(() => {
            // predictions.forEach((prediction) => {
            //   console.log('prediction: ', prediction);
            // });
            resolve(predictions);
          });
        }
      );
    });
  }

  async getLocationByPlaceID(placeID: string) {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ placeId: placeID }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            resolve({
              location: results[0].geometry.location,
              formatted_address: results[0].formatted_address,
              address_components: results[0].address_components,
              types: results[0].types,
            });
          } else {
            reject([]);
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
          reject([]);
        }
      });
    });
  }

  async getLocationByLatLng(lat: any, lng: any) {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      const latlng = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK') {
          if (results && results[0]) {
            resolve({
              place_id: results[0].place_id,
              location: results[0].geometry.location,
              formatted_address: results[0].formatted_address,
              address_components: results[0].address_components,
              types: results[0].types,
            });
          } else {
            reject([]);
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
          reject([]);
        }
      });
    });
  }
}
