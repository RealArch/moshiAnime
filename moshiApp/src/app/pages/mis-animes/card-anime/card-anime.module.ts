import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardAnimePageRoutingModule } from './card-anime-routing.module';

import { CardAnimePage } from './card-anime.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardAnimePageRoutingModule
  ],
  declarations: [CardAnimePage],
  exports:[CardAnimePage]
})
export class CardAnimePageModule {}
