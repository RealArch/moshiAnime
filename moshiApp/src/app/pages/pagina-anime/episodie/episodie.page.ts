import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';
import { ApiService } from 'src/app/services/api.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-episodie',
  templateUrl: './episodie.page.html',
  styleUrls: ['./episodie.page.scss'],
})
export class EpisodiePage implements OnInit {
  animeId: string;
  episodeId: string
  loadingVideo: boolean;
  video: any;
  apiVideogular: VgApiService;
  subscriptions: Subscription[] = [];
  currentTime: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private androidFullScreen: AndroidFullScreen,
    private screenOrientation: ScreenOrientation,
  ) { }

  ngOnInit() {
    this.loadingVideo = true
    this.animeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.episodeId = this.activatedRoute.snapshot.paramMap.get('episodeId')
    this.api.getAnimeVideo(this.animeId,this.episodeId)
    .subscribe(data=>{
      this.video = data['url']
      this.loadingVideo = false
    })
    // this.video = 'assets/video.mp4'
    // this.loadingVideo = false
  }
  onPlayerReady(api: VgApiService) {
    this.apiVideogular = api;
    //Fullscreen and rotate
    this.subscriptions.push(
      this.apiVideogular.fsAPI.onChangeFullscreen.subscribe((ev) => {
        if (ev) {
          this.androidFullScreen.leanMode()
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
        } else {
          this.androidFullScreen.showSystemUI()
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

        }
      })
    )
    //Event time change
    this.subscriptions.push(

      this.apiVideogular.getDefaultMedia().subscriptions.timeUpdate
        .subscribe(time => {
          this.currentTime = time.srcElement.currentTime
        })
    )
  }
  any(d) {
    console.log(d)
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    //Guardar progreso del episodio
  }

}
