import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistancePipe } from './distance/distance.pipe';
import { TruncatePipe } from './truncate/truncate.pipe';

@NgModule({
  declarations: [DistancePipe, TruncatePipe],
  imports: [CommonModule],
  exports: [DistancePipe, TruncatePipe],
})
export class PipesModule {}
