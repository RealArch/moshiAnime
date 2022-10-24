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
    // const info = await Device.getInfo();
    // var platform = Capacitor.getPlatform()
    // if (platform === "ios" || platform === "android") {
    //   this.videoPlayer = CapacitorVideoPlayer;
    // } else {
    //   this.videoPlayer = PluginsLibrary.CapacitorVideoPlayer
    // }
  }
  onMessage(event: CustomEvent<any>) {
    const message = event.detail;
  }
  play(url: string) {
    // console.log(this.videoPlayer)
    // this.videoPlayer.play('file:///android_asset/www/movie.mp4')
    // document.addEventListener('jeepCapVideoPlayerPlay', (e: CustomEvent) => { console.log('Event jeepCapVideoPlayerPlay ', e.detail) }, false);
    // document.addEventListener('jeepCapVideoPlayerPause', (e: CustomEvent) => { console.log('Event jeepCapVideoPlayerPause ', e.detail) }, false);
    // document.addEventListener('jeepCapVideoPlayerEnded', (e: CustomEvent) => { console.log('Event jeepCapVideoPlayerEnded ', e.detail) }, false);
    // const res: any = await this.videoPlayer.initPlayer({ mode: "fullscreen", url: url, playerId:'playerid' });
  }

}
