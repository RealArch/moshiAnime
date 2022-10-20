import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisAnimesPageRoutingModule } from './mis-animes-routing.module';

import { MisAnimesPage } from './mis-animes.page';
import { CardAnimePageModule } from './card-anime/card-anime.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisAnimesPageRoutingModule,
    CardAnimePageModule
  ],
  declarations: [MisAnimesPage],
  providers:[CardAnimePageModule]
})
export class MisAnimesPageModule {}
