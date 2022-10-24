import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EpisodiePage } from './episodie.page';

const routes: Routes = [
  {
    path: '',
    component: EpisodiePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EpisodiePageRoutingModule {}
