import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaginaAnimePageRoutingModule } from './pagina-anime-routing.module';

import { PaginaAnimePage } from './pagina-anime.page';
import { VideoItemPage } from './video-item/video-item.page';
import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';
import { VideoItemPageModule } from './video-item/video-item.module';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaginaAnimePageRoutingModule,
    VideoItemPageModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  declarations: [PaginaAnimePage],
  providers:[VideoPlayer,VideoItemPageModule]
})
export class PaginaAnimePageModule {}
