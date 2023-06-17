import { NgModule } from '@angular/core';

import { GridComponent } from './grid.component';
import { KtdGridModule } from '@katoid/angular-grid-layout';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [KtdGridModule, CommonModule],
  declarations: [GridComponent],
  exports: [GridComponent],
})
export class GridModule {}
