import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  NgZone,
} from '@angular/core';
import {
  ModalController,
  IonSearchbar,
  Platform,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import isEmpty from 'lodash-es/isEmpty';
import each from 'lodash-es/each';
import { Plugins, PermissionType } from '@capacitor/core';

import { MapComponentComponent } from '../map-component/map-component.component';
import { PlaceSearchService } from '../../../services/place.search.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { STORE_USER_LOCATION } from '../../constants/utils';

declare const google: any;

@Component({
  selector: 'app-search-location',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent implements OnInit {
  showSearch: boolean;
  isSearching: boolean;
  searchText: string;

  searchResultArr: any[] = [];
  fakeArr: any[] = [];

  currentCoords = {
    latitude: 0,
    longitude: 0,
  };
  mapCenter: google.maps.LatLngLiteral;
  mapObject: any;

  @ViewChild('searchbar', { read: IonSearchbar }) searchbar: IonSearchbar;
  constructor(
    public platform: Platform,
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private searchService: PlaceSearchService,
    private localStorageService: LocalStorageService
  ) {
    this.fakeArr = Array.from({ length: 20 });
  }

  ngOnInit(): void {
    this.showSearch = false;
    this.isSearching = false;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.checkGeolocationPermission();
    }, 300);
  }

  async getCurrentPosition() {
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      const coordinates = await Plugins.Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      this.currentCoords = coordinates.coords;
      this.mapCenter = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
      };
    } else {
      const success = (pos) => {
        const crd = pos.coords;
        this.currentCoords = crd;
        this.mapCenter = {
          lat: crd.latitude,
          lng: crd.longitude,
        };
      };

      const error = (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      };

      navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    }
  }

  async onSearchPlaces(ev: any) {
    this.searchText = ev.target.value;
    if (!isEmpty(this.searchText)) {
      this.isSearching = true;

      this.searchService
        .searchGooglePlaces(this.searchText, this.mapCenter)
        .then((places) => {
          if (places) {
            console.log('places: ', places);
            this.showSearch = true;
            this.searchResultArr = [];
            each(places, (row) => {
              this.searchResultArr.push({
                id: row.id,
                place_id: row.place_id,
                title: row.structured_formatting.main_text,
                subtitle: row.structured_formatting.secondary_text,
                description: row.description,
                distance_meters: row.distance_meters,
                structured_formatting: row.structured_formatting,
                terms: row.terms,
                types: row.types,
              });
            });
          } else {
            this.isSearching = false;
            this.searchResultArr = [];
          }
        });
    } else {
      this.searchResultArr = [];
      this.isSearching = false;
      this.showSearch = false;
    }
  }

  async onUseCurrentLocation() {
    const modal = await this.modalController.create({
      component: MapComponentComponent,
      cssClass: 'modal-fullscreen',
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    this.currentCoords = data;
    console.log('this.currentCoords: ', data);
    if (this.currentCoords) {
      console.log('dismiss');
      this.dismiss();
    }
  }

  async selectLocation(location: any) {
    console.log('selectLocation: ', location);
    const loading = await this.loadingController.create();
    loading.present();
    this.searchService
      .getLocationByPlaceID(location.place_id)
      .then(
        (result: any) => {
          console.log('result: ', result);
          loading.dismiss();
          const place = {
            place_id: location.place_id,
            address: result.formatted_address,
            description: location.description,
            title: location.title,
            subtitle: location.subtitle,
            location: result.location,
          };
          this.localStorageService.setItem(STORE_USER_LOCATION, place);
        },
        () => {
          loading.dismiss();
        }
      )
      .then(() => {
        this.modalController.dismiss();
      });
  }

  dismiss() {
    console.log('dismiss');
    this.modalController.dismiss(null, null, 'search-location-modal');
  }

  private async checkGeolocationPermission() {
    const has: any = await Plugins.Permissions.query({
      name: PermissionType.Geolocation,
    });
    console.log('Geo has: ', has);

    if (has.state && (has.state === 'prompt' || has.state === 'denied')) {
      this.registerGeolocationPermission();
    } else if (has.state && has.state === 'granted') {
      this.getCurrentPosition();
    }
  }

  private registerGeolocationPermission() {
    setTimeout(() => {
      this.getCurrentPosition();
    }, 300);
  }
}
