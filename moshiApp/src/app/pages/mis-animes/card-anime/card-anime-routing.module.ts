import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardAnimePage } from './card-anime.page';

const routes: Routes = [
  {
    path: '',
    component: CardAnimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardAnimePageRoutingModule {}
