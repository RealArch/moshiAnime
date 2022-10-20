import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalEpisodiosPageRoutingModule } from './modal-episodios-routing.module';

import { ModalEpisodiosPage } from './modal-episodios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalEpisodiosPageRoutingModule
  ],
  declarations: [ModalEpisodiosPage]
})
export class ModalEpisodiosPageModule {}
