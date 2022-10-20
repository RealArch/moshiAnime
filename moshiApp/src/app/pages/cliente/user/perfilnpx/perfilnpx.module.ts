import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilnpxPageRoutingModule } from './perfilnpx-routing.module';

import { PerfilnpxPage } from './perfilnpx.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilnpxPageRoutingModule
  ],
  declarations: [PerfilnpxPage]
})
export class PerfilnpxPageModule {}
