import { Component, Input, OnInit } from '@angular/core';

import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';


// import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';


@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.page.html',
  styleUrls: ['./video-item.page.scss'],
})
export class VideoItemPage implements OnInit {
  @Input('url') url
  @Input('id') id
  params
  constructor(
    private videoPlayer: VideoPlayer
  ) { }

  ngOnInit() {
    this.url = 'https://media.vimejs.com/720p.mp4'
    console.log(this.url)
    console.log(this.id)
  }
  async ngAfterViewInit() {

  }


}
