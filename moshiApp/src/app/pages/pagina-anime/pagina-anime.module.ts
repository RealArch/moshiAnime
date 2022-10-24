import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaginaAnimePageRoutingModule } from './pagina-anime-routing.module';

import { PaginaAnimePage } from './pagina-anime.page';
import { VideoItemPage } from './video-item/video-item.page';
import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';
import { VideoItemPageModule } from './video-item/video-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaginaAnimePageRoutingModule,
    VideoItemPageModule
  ],
  declarations: [PaginaAnimePage],
  providers:[VideoPlayer,VideoItemPageModule]
})
export class PaginaAnimePageModule {}
