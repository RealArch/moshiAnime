import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaAnimePage } from './pagina-anime.page';

const routes: Routes = [
  {
    path: '',
    component: PaginaAnimePage
  },
  {
    path: 'modal-episodios',
    loadChildren: () => import('./modal-episodios/modal-episodios.module').then( m => m.ModalEpisodiosPageModule)
  },
  {
    path: 'modal-estatus',
    loadChildren: () => import('./modal-estatus/modal-estatus.module').then( m => m.ModalEstatusPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaginaAnimePageRoutingModule {}
