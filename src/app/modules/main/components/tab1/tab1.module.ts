import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Tab1Page } from './tab1.page';
import { NoBusinessComponent } from './no-business/no-business.component';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { ComponentsModule } from './../../../../shared/components/components.module';
import { PipesModule } from './../../../../shared/pipes/pipes.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    ComponentsModule,
    PipesModule,
  ],
  declarations: [Tab1Page, NoBusinessComponent],
  exports: [NoBusinessComponent],
})
export class Tab1PageModule {}
