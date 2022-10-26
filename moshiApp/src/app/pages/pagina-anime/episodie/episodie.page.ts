import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';
import { ApiService } from 'src/app/services/api.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { combineLatest, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/authentication/auth.service';

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
  videoStatus: any = 'loading';
  duration: any;
  userUid: string;
  interval;
  updateTime: number = 20000;
  combineLatestSub: Subscription;
  publicUserData: any;
  lastTime: any = 0;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private androidFullScreen: AndroidFullScreen,
    private screenOrientation: ScreenOrientation,
    private auth: AuthService
  ) { }

  async ngOnInit() {
    this.currentTime = this.lastTime
    this.loadingVideo = true
    this.animeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.episodeId = this.activatedRoute.snapshot.paramMap.get('episodeId')
    this.auth.isLogged()
      .subscribe(user => {
        this.combineLatestSub = combineLatest([
          this.api.getAnimeVideo(this.animeId, this.episodeId),
          this.api.getPublicUserData(user.uid)

        ]).subscribe(([animeVideo, publicUserData]) => {
          this.video = animeVideo['url']
          //publicUserData
          this.publicUserData = publicUserData
          //Get lastTime in seconds
          this.lastTime = this.api.searchTimeAnimeEpisode(this.episodeId, this.animeId, this.publicUserData.viewedAnimes)

          this.loadingVideo = false
        })
      })


    // this.video = 'assets/video.mp4'
    // this.loadingVideo = false

    //Guardar track en DB
    //Cada 20 segundos si esta en play
    //al salir de la pagina
    //getDuration time




  }

  requestSaveTime(videoStatus) {
    if (videoStatus != 'playing') return
    console.log('corresponde guardar')
    this.saveTime()
  }
  saveTime() {
    this.api.updateAnime(this.userUid, this.currentTime, this.animeId, this.episodeId, this.duration)
      .then(data => {
        console.log('actualizado')
      }).catch(err => {
        console.log('err')
        console.log(err)
      })
  }


  onPlayerReady(api: VgApiService) {
    this.apiVideogular = api;
    //Fullscreen and rotate

    api.seekTime(this.lastTime)
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
    //

    //Event time change
    this.subscriptions.push(

      this.apiVideogular.getDefaultMedia().subscriptions.timeUpdate
        .subscribe(time => {
          this.currentTime = time.srcElement.currentTime
        })
    )
    //Detect canPlay
    this.subscriptions.push(
      this.apiVideogular.getDefaultMedia().subscriptions.loadedMetadata
        .subscribe(data => {
          this.duration = this.apiVideogular.duration
          console.log(this.duration)
        })
    )
    //Detect playing
    this.subscriptions.push(
      this.apiVideogular.getDefaultMedia().subscriptions.playing
        .subscribe(data => {
          this.videoStatus = 'playing'
          console.log('playing')
        })
    )
    this.subscriptions.push(
      this.apiVideogular.getDefaultMedia().subscriptions.pause
        .subscribe(data => {
          this.videoStatus = 'pause'

          console.log('pause')
        })
    )
    this.subscriptions.push(
      this.apiVideogular.getDefaultMedia().subscriptions.waiting
        .subscribe(data => {
          this.videoStatus = 'waiting'

          console.log('waiting')
        })
    )
    console.log('entre a playerReady')
    this.subscriptions.push(
      this.api.isLoggedIn().subscribe(user => {
        this.userUid = user.uid
        this.interval = setInterval(() => { this.requestSaveTime(this.videoStatus) }, this.updateTime)
      }, err => {
        console.log('no se esta guardando en la db el tiempo')
      })
    )
  }
  ngOnDestroy() {
    console.log('sali')
    this.subscriptions.forEach(s => s.unsubscribe());
    clearInterval(this.interval)
    //Guardar progreso del episodio si es diferente current time y prev current time
    console.log(this.currentTime)
    console.log(this.lastTime)
    if (this.currentTime != this.lastTime) {
      console.log('salimos, guardamos')
      this.saveTime()
    }
  }
  // ionViewWillLeave() {
  //   console.log('me fui')
  //   this.subscriptions.forEach(s => s.unsubscribe());

  // }

}
