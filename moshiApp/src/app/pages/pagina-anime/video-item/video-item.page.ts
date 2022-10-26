import { Component, Input, OnInit } from '@angular/core';

import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';


// import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';


@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.page.html',
  styleUrls: ['./video-item.page.scss'],
})
export class VideoItemPage implements OnInit {
  @Input('id') id
  @Input('viewedPercentage') viewedPercentage
  @Input('animeData') animeData
  @Input('episodeData') episodeData

  
  
  params
  constructor(
    private videoPlayer: VideoPlayer
  ) { }

  ngOnInit() {
  }
  async ngAfterViewInit() {

  }


}
