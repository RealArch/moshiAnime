import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemVertical1Page } from './item-vertical1.page';

const routes: Routes = [
  {
    path: '',
    component: ItemVertical1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemVertical1PageRoutingModule {}
