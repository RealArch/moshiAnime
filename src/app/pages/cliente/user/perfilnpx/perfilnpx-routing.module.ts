import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilnpxPage } from './perfilnpx.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilnpxPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilnpxPageRoutingModule {}
