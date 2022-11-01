import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';
import { ApiService } from 'src/app/services/api.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { combineLatest, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { createGesture, Gesture, GestureController } from '@ionic/angular';
declare var cast
declare var chrome
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
  constructor(
    private gestureCtrl: GestureController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private androidFullScreen: AndroidFullScreen,
    private screenOrientation: ScreenOrientation,
    private auth: AuthService
  ) {
    this.initCast()

  }
  test() {
    console.log('okok')

  }
  ngAfterViewInit() {


    //config cast
    console.log(chrome)
    console.log('cargué todo')
    //Gesture
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
  }
  initCast() {
    // console.log(window['__onGCastApiAvailable'])
    cast.framework.CastContext.getInstance().setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    });
    document.createElement("google-cast-launcher");

    // this.initializeCastApi = function () {
    //   console.log('okokookokkok')
    //     setTimeout(() => {
    //       console.log('inicialice cast')
    //       cast.framework.CastContext.getInstance().setOptions({
    //         receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    //         autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    //       });
    //     }, 0)


    // };
    // window['__onGCastApiAvailable'] = function (isAvailable) {
    //   console.log(2)
    //   if (isAvailable) {
    //     this.initializeCastApi = function () {
    //       if (isAvailable) {
    //         setTimeout(() => {
    //           console.log('inicialice cast')
    //           cast.framework.CastContext.getInstance().setOptions({
    //             receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    //             autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    //           });
    //         }, 0)
    //       }

    //     };
    //   }
    // };
  }
  requestCast() {
    console.log('aja')
    var castSession = cast.framework.CastContext.getInstance().getCurrentSession();

    var mediaInfo = new chrome.cast.media.MediaInfo(this.video, 'video/mp4');
    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    console.log(castSession)
    // castSession.loadMedia(request).then(
    //   function () { console.log('Load succeed'); },
    //   function (errorCode) { console.log('Error code: ' + errorCode); });
  }
  async ngOnInit() {
    ///INICIALIZAR GESTOS


    ///
    this.currentTime = this.lastTime
    this.loadingVideo = true
    this.animeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.episodeId = this.activatedRoute.snapshot.paramMap.get('episodeId')
    // this.auth.isLogged()
    //   .subscribe(user => {
    //     this.subscriptions.push(
    //       combineLatest([
    //         this.api.getAnimeVideo(this.animeId, this.episodeId),
    //         this.api.getPublicUserData(user.uid)

    //       ]).subscribe(([animeVideo, publicUserData]) => {
    //         this.video = animeVideo['url']
    //         //publicUserData
    //         this.publicUserData = publicUserData
    //         //Get lastTime in seconds
    //         this.lastTime = this.api.searchTimeAnimeEpisode(this.episodeId, this.animeId, this.publicUserData.viewedAnimes)

    //         this.loadingVideo = false
    //       })
    //     )
    //   })


    this.video = 'assets/video.mp4'
    this.loadingVideo = false

    //Guardar track en DB
    //Cada 20 segundos si esta en play
    //al salir de la pagina
    //getDuration time




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
