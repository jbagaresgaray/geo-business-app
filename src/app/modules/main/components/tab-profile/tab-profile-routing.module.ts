import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabProfileComponent } from './tab-profile.component';

const routes: Routes = [{ path: '', component: TabProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabProfileRoutingModule { }
