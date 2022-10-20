import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalEstatusPage } from './modal-estatus.page';

const routes: Routes = [
  {
    path: '',
    component: ModalEstatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalEstatusPageRoutingModule {}
