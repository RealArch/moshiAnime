import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';
import { ApiService } from 'src/app/services/api.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { combineLatest, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { createGesture, Gesture, GestureController } from '@ionic/angular';
// declare var cast
// declare var chrome
@Component({
  selector: 'app-episodie',
  templateUrl: './episodie.page.html',
  styleUrls: ['./episodie.page.scss'],
})
export class EpisodiePage implements OnInit {
  animeId: string;
  episodeId: number
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
  player
  private lastOnStart: number = 0;
  private DOUBLE_CLICK_THRESHOLD: number = 500;
  playerWidth: number;
  playbackInterval: NodeJS.Timeout;
  forward: boolean;
  back: boolean;
  forwardInterval: NodeJS.Timeout;
  backInterval: NodeJS.Timeout;
  playerHeight: number;
  initializeCastApi
  titleEpisode: string;
  titleAnime: string;
  animeData: import("@angular/fire/firestore").DocumentData;
  user: import("@angular/fire/auth").User;
  loadingData: boolean;
  constructor(
    private gestureCtrl: GestureController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private androidFullScreen: AndroidFullScreen,
    private screenOrientation: ScreenOrientation,
    private auth: AuthService
  ) {

  }

  async ngOnInit() {
    this.loadingData = true
    this.loadingVideo = true
    this.currentTime = this.lastTime
    this.animeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.episodeId = parseInt(this.activatedRoute.snapshot.paramMap.get('episodeId'))
    this.titleAnime = this.activatedRoute.snapshot.queryParamMap.get('titleAnime')
    this.auth.isLogged()
      .subscribe(user => {
        this.user = user
        this.loadEpisode(this.episodeId)

      })
    // this.video = 'assets/video.mp4'
    // this.loadingVideo = false
  }
  loadEpisode(episodeId ) {
    this.clean()
    this.episodeId = episodeId
    this.loadingData = true
    this.loadingVideo = true
    this.subscriptions.push(
      combineLatest([
        this.api.getAnimeVideo(this.animeId, episodeId),
        this.api.getPublicUserData(this.user.uid),
        this.api.getAnimeData(this.animeId)
      ]).subscribe(async ([animeVideo, publicUserData, animeData]) => {
        this.video = animeVideo['url']
        //publicUserData
        this.publicUserData = publicUserData
        //ANimeData
        this.animeData = animeData
        this.titleEpisode = this.animeData.scrapedEpisodes.sub_esp[episodeId-1].title

        console.log(animeData)
        //Get lastTime in seconds
        this.lastTime = this.api.searchTimeAnimeEpisode(episodeId, this.animeId, this.publicUserData.viewedAnimes)
        this.loadingVideo = false
        this.loadingData = false
        setTimeout(() => {
          this.player = document.getElementById('player')
          const gesture = this.gestureCtrl.create({
            gestureName: 'doubleTap',
            el: this.player,
            threshold: 0,
            onStart: (t) => { this.onStart(t); }
          });
          let resizeObserver = new ResizeObserver((e) => {
            this.playerWidth = e[0].contentRect.width
            this.playerHeight = e[0].contentRect.height
          });
          resizeObserver.observe(this.player);
          gesture.enable();
        }, 100)

      })
    )
  }

  private onStart(t) {
    const now = Date.now();

    if (Math.abs(now - this.lastOnStart) <= this.DOUBLE_CLICK_THRESHOLD) {
      clearInterval(this.forwardInterval)
      clearInterval(this.backInterval)
      this.forward = false
      this.back = false
      //calcurar porcentage en x y en y
      var screenTouchXPercentage = t.startX * 100 / this.playerWidth
      var screenTouchYPercentage = t.startY * 100 / this.playerHeight
      if (screenTouchYPercentage > 95) return

      //si startX es mayor al 60%, aumente 10 segundos
      if (screenTouchXPercentage > 60) {
        this.apiVideogular.seekTime(this.apiVideogular.currentTime + 10)
        this.forward = true
        this.forwardInterval = setInterval(() => {
          this.forward = false
          clearInterval(this.backInterval)

          clearInterval(this.forwardInterval)
        }, 1000)
      }
      //si startX es menor al 40%, aumente 10 segundos
      if (screenTouchXPercentage < 40) {
        this.apiVideogular.seekTime(this.apiVideogular.currentTime - 10)
        this.back = true
        this.backInterval = setInterval(() => {
          this.back = false
          clearInterval(this.backInterval)
          clearInterval(this.forwardInterval)

        }, 1000)
      }


      this.lastOnStart = 0;
    } else {
      this.lastOnStart = now;
    }
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


  async onPlayerReady(api: VgApiService) {
    try {
      console.log('ready')
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
          })
      )
      //Detect playing
      this.subscriptions.push(

        this.apiVideogular.getDefaultMedia().subscriptions.playing
          .subscribe(data => {
            this.videoStatus = 'playing'
            console.log('playing')
          }, err => {
            console.log(err)
            console.log('error play')
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
      this.subscriptions.push(
        this.apiVideogular.getDefaultMedia().subscriptions.loadedData
          .subscribe(data => {
            // this.videoStatus = 'waiting'
            api.seekTime(this.lastTime)
            console.log('laoded data')
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
      //ONVGERROR
      this.subscriptions.push(
        this.apiVideogular.getDefaultMedia().subscriptions.error
          .subscribe(data => {
            this.videoStatus = 'error'

            // console.log('error')
            // //leer nuevamente la url de la db
            // this.api.getAnimeVideo(this.animeId, this.episodeId)
            //   .subscribe(data => {
            //     var lastTime = this.apiVideogular.currentTime
            //     //Actualizar la url del video
            //     var video = document.getElementById('singleVideo');
            //     video.setAttribute('src', data['url'])
            //     this.apiVideogular.pause()           

            //   })

            if (this.apiVideogular.canPlay) {
              this.api.getAnimeVideo(this.animeId, this.episodeId)
                .subscribe(data => {
                  console.log('error 2')
                  var lastTime = this.apiVideogular.currentTime
                  //Actualizar la url del video
                  var video = document.getElementById('singleVideo');
                  video.setAttribute('src', data['url'])
                  this.apiVideogular.pause()

                })
            }


          })
      )

    } catch (error) {
      console.log('error 1')
      console.log(error)
    }

  }

  ngOnDestroy() {
    this.clean()
  }
  clean(){
    this.subscriptions.forEach(s => s.unsubscribe());
    clearInterval(this.interval)
    //Guardar progreso del episodio si es diferente current time y prev current time
    if (this.currentTime != this.lastTime) {
      this.saveTime()
    }
  }
  // ionViewWillLeave() {
  //   console.log('me fui')
  //   this.subscriptions.forEach(s => s.unsubscribe());

  // }

}
