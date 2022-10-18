import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisAnimesPage } from './mis-animes.page';

const routes: Routes = [
  {
    path: '',
    component: MisAnimesPage
  },
  {
    path: 'card-anime',
    loadChildren: () => import('./card-anime/card-anime.module').then( m => m.CardAnimePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisAnimesPageRoutingModule {}
