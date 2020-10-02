import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabProfileRoutingModule } from './tab-profile-routing.module';
import { TabProfileComponent } from './tab-profile.component';

@NgModule({
  declarations: [TabProfileComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: TabProfileComponent }]),
    TabProfileRoutingModule,
  ],
})
export class TabProfileModule {}
