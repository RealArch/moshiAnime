import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaginaAnimePageRoutingModule } from './pagina-anime-routing.module';

import { PaginaAnimePage } from './pagina-anime.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaginaAnimePageRoutingModule
  ],
  declarations: [PaginaAnimePage]
})
export class PaginaAnimePageModule {}
