import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalEstatusPageRoutingModule } from './modal-estatus-routing.module';

import { ModalEstatusPage } from './modal-estatus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalEstatusPageRoutingModule
  ],
  declarations: [ModalEstatusPage]
})
export class ModalEstatusPageModule {}
