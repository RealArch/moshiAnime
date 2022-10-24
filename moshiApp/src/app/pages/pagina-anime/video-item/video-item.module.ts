import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoItemPageRoutingModule } from './video-item-routing.module';

import { VideoItemPage } from './video-item.page';
import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoItemPageRoutingModule,
    
  ],
  declarations: [VideoItemPage],
  exports:[VideoItemPage],
  providers:[VideoPlayer]
})
export class VideoItemPageModule {}
