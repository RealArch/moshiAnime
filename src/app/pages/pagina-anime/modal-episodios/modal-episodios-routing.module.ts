import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalEpisodiosPage } from './modal-episodios.page';

const routes: Routes = [
  {
    path: '',
    component: ModalEpisodiosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalEpisodiosPageRoutingModule {}
