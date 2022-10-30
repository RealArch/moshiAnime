import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeasonsPage } from './seasons.page';

const routes: Routes = [
  {
    path: '',
    component: SeasonsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeasonsPageRoutingModule {}
