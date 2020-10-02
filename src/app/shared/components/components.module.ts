import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AvatarModule } from 'ngx-avatar';
import { GoogleMapsModule } from '@angular/google-maps';

import { PipesModule } from './../pipes/pipes.module';

import { MenuItemComponent } from './menu-item/menu-item.component';
import { InfoErrorCardComponent } from './info-error-card/info-error-card.component';
import { MapComponentComponent } from './map-component/map-component.component';
import { SearchLocationComponent } from './search-location/search-location.component';

@NgModule({
  declarations: [
    MenuItemComponent,
    InfoErrorCardComponent,
    SearchLocationComponent,
    MapComponentComponent,
  ],
  imports: [CommonModule, IonicModule, AvatarModule, GoogleMapsModule, PipesModule],
  exports: [
    MenuItemComponent,
    InfoErrorCardComponent,
    SearchLocationComponent,
    MapComponentComponent,
  ],
})
export class ComponentsModule {}
