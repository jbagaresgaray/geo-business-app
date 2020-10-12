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
import { ModalRadiusComponent } from './modal-radius/modal-radius.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MenuItemComponent,
    InfoErrorCardComponent,
    SearchLocationComponent,
    MapComponentComponent,
    ModalRadiusComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    AvatarModule,
    GoogleMapsModule,
    FormsModule,
    PipesModule,
  ],
  exports: [
    MenuItemComponent,
    InfoErrorCardComponent,
    SearchLocationComponent,
    MapComponentComponent,
    ModalRadiusComponent,
  ],
})
export class ComponentsModule {}
