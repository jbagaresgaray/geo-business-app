import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AvatarModule } from 'ngx-avatar';

import { MenuItemComponent } from './menu-item/menu-item.component';
import { InfoErrorCardComponent } from './info-error-card/info-error-card.component';

@NgModule({
  declarations: [MenuItemComponent, InfoErrorCardComponent],
  imports: [CommonModule, IonicModule, AvatarModule],
  exports: [MenuItemComponent, InfoErrorCardComponent],
})
export class ComponentsModule {}
