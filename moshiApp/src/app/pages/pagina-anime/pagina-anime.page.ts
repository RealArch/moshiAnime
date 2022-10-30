import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ActionSheetController, AlertController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { ModalEpisodiosPage } from './modal-episodios/modal-episodios.page';
import { ModalEstatusPage } from './modal-estatus/modal-estatus.page';

import { Auth, getAuth } from '@angular/fire/auth';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';

import { VgApiService } from '@videogular/ngx-videogular/core';


// import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { combineLatest, Subscription } from 'rxjs';
import { PopupsService } from 'src/app/services/popups/popups.service';

@Component({
  selector: 'app-pagina-anime',
  templateUrl: './pagina-anime.page.html',
  styleUrls: ['./pagina-anime.page.scss'],
})
export class PaginaAnimePage implements OnInit {
  apiVideogular: VgApiService;
  anime
  loading: boolean;
  urlTioAnime: string;
  servidores = [
    {
      id: 0,
      name: 'JK anime',
      idiomas: ['Esp'],
      link: "https://jkanime.net/"
    },
    {
      id: 0,
      name: 'Tio anime',
      idiomas: ['Esp'],
      link: "https://tioanime.com/directorio?q="
    },
    {
      id: 1,
      name: 'AnimeKisa(eng)',
      idiomas: ['Eng'],
      link: "https://animekisa.tv/search?q="
    }
  ]
  servidorActivo
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 3,
    spaceBetween: 10,
    freeMode: true
  };
  characters: any;
  // userInfo: any;
  snapshotMiInfoAnime: string;
  miInfoAnime: any = '';
  uid: any;
  actualizando: boolean;
  malId: string;
  animeData: import("@angular/fire/firestore").DocumentData;
  userData: import("@angular/fire/firestore").DocumentData;
  queryAnimeTitle: any;
  loadingUpdateFav: boolean;
  isFav = false
  subscriptions: Subscription[] = [];
  constructor(
    private androidFullScreen: AndroidFullScreen,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private _auth: Auth,
    private modalController: ModalController,
    private navController: NavController,
    private alertController: AlertController,
    private toastController: ToastController,
    private apiPopups: PopupsService
    // private videoPlayer: VideoPlayer
  ) { }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  ngOnInit() {
    //2 finalizados
    //6 plan to watch
    //1 watching 
    this.loading = true
    var user = getAuth().currentUser
    console.log(user)
    this.malId = this.activatedRoute.snapshot.paramMap.get('id')
    this.queryAnimeTitle = this.activatedRoute.snapshot.queryParamMap.get('title')
    console.log(this.queryAnimeTitle)
    if (user != null) {
      this.subscriptions.push(
        combineLatest([
          this.api.getAnimeData(this.malId),
          this.api.getPublicUserData(user.uid)
        ]).subscribe(([animeData, userData]) => {
          this.uid = user.uid
          //animeData
          this.animeData = animeData
          //userData
          this.userData = userData
          //Check if its fav
          this.isFav = this.api.isFavLocal(this.userData.favAnimes, this.malId)
          //
          this.addTimeToEpisode(this.malId, this.userData.viewedAnimes, this.animeData)
          this.loading = false
        })
      )

      this.api.getStaffByMalId(this.malId)
        .subscribe(staffMal => {
          //STAFF
          this.characters = staffMal['data']
        })

    }

  }

  toggleFav() {
    if (this.loadingUpdateFav)
      return
    this.loadingUpdateFav = true
    this.api.toggleFav(this.malId)
      .then(() => {
        console.log('volvi')
      }).catch(err => {
        console.log(err)
        this.apiPopups.toast('danger', 'Ocurrió un problema a modificar los favoritos.')
      }).finally(() => {
        this.loadingUpdateFav = false
      })



  }
  addTimeToEpisode(animeId, viewedAnimes, animeData) {
    for (let j = 0; j < animeData.scrapedEpisodes.sub_esp.length; j++) {
      animeData.scrapedEpisodes.sub_esp[j].viewedPercentage = this.getTimeFromId(animeId, j + 1, viewedAnimes)
    }
  }
  getTimeFromId(animeId, episodeId, viewedAnimes) {
    //  console.log(episodeId)
    console.log(viewedAnimes)
    //  console.log(animeId)
    for (let i = 0; i < viewedAnimes.length; i++) {
      //leer todos lo animes vistos
      //si coincide con este animeId, comparar



      console.log(viewedAnimes[i].animeId)
      console.log(animeId)
      if (viewedAnimes[i].animeId == animeId) {
        console.log("encontramos el anime")
        //Luego buscar el id del espisodio
        for (let j = 0; j < viewedAnimes[i].episodes.length; j++) {
          if (viewedAnimes[i].episodes[j].episodeId == episodeId) {
            console.log("encontramos el episodio")
            //calcular porcentaje entre 0 y 1
            var percentage = viewedAnimes[i].episodes[j].lastTime * 100 / viewedAnimes[i].episodes[j].duration
            return percentage / 100
          }
        }
        return 0
      }
    }
    return 0
  }

  goBack() {
    if (this.snapshotMiInfoAnime != this.miInfoAnime) {
      this.confirmacionSalida()

    } else {
      this.navController.back()
    }
  }
  cargarMiAnime(userInfo) {
    console.log(userInfo)
    for (let i = 0; i < userInfo.listaAnime.length; i++) {
      if (userInfo.listaAnime[i].mal_id == this.activatedRoute.snapshot.paramMap.get('id')) {
        this.miInfoAnime = userInfo.listaAnime[i]
      }
    }
    var data = this.miInfoAnime
    this.snapshotMiInfoAnime = data
  }
  ver() {
    //TIO ANIME
    var busqueda = this.prepararTitulo(this.anime.title)
    var link = this.servidores[this.servidorActivo].link + busqueda
    // console.log(link)
    this.router.navigate(['/pagina-anime/', this.anime.mal_id, link])

    // [routerLink]="['/pagina-anime/',anime.mal_id,url]"
  }
  prepararTitulo(title) {

    title = title.replace(/_|#|:|@|!|<>/g, "")
    title = title.replaceAll('(', '').toLowerCase()
    title = title.replaceAll(')', '').toLowerCase()
    title = title.replaceAll('.', '').toLowerCase()
    title = title.replaceAll(',', '').toLowerCase()
    title = title.replaceAll(' ', '-').toLowerCase()

    return title
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona el servidor',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Tio anime (esp)',
        handler: () => {
          this.servidorActivo = 0
        }
      },
      {
        text: 'AnimeKisa (eng)',
        handler: () => {
          this.servidorActivo = 1
        }
      },
      {
        text: 'Cancelar',
        role: 'Cancel',
        handler: () => {
          console.log('Delete clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  async selecionarVistos() {
    const modal = await this.modalController.create({
      component: ModalEpisodiosPage,
      cssClass: 'modalEpisodios',
      backdropDismiss: true,
      componentProps: {
        'episodios': this.anime.episodes,
        episodioActual: this.miInfoAnime.watched_episodes || 0
      }
    });
    modal.onWillDismiss()
      .then(data => {
        this.miInfoAnime = {
          mal_id: this.anime.mal_id,
          title: this.anime.title,
          watching_status: this.miInfoAnime.watching_status,
          watched_episodes: data.data['episodio']
        }
        console.log(data.data['episodio'])
      })
    return await modal.present();
  }
  async seleccionarStatusModal() {
    const modal = await this.modalController.create({
      component: ModalEstatusPage,
      cssClass: 'modalStatus',
      backdropDismiss: true,
      componentProps: {

      }
    });
    modal.onWillDismiss()
      .then(data => {
        this.miInfoAnime = {
          mal_id: this.anime.mal_id,
          title: this.anime.title,
          watching_status: data.data['estatus'],
          watched_episodes: this.miInfoAnime.watched_episodes || 0
        }
      })
    return await modal.present();
  }
  actualizar() {
    // this.actualizando = true
    // this.prepararArray()
    // this.api.actualizarLista(this.uid, this.userInfo.listaAnime)
    //   .then(data => {
    //     this.actualizando = false
    //     console.log('si guarde')
    //     this.toast('Tu perfil ha sido actualizado')

    //   }).catch(err => {
    //     this.actualizando = false
    //     console.log(err)
    //     this.toast('Ocurrió un error al actualizar el perfil')

    //   })
  }
  actualizarSalir() {
    // this.actualizando = true
    // this.prepararArray()
    // console.log('entre a actualizar')
    // this.api.actualizarLista(this.uid, this.userInfo.listaAnime)
    //   .then(data => {
    //     this.actualizando = false
    //     console.log('si guarde')
    //     this.toast('Tu perfil ha sido actualizado')
    //     this.navController.back()
    //   }).catch(err => {
    //     this.toast('Ocurrió un error al actualizar el perfil')

    //     this.actualizando = false
    //     console.log(err)
    //   })
  }
  prepararArray() {
    // var existe = false
    // var index
    // for (let i = 0; i < this.userInfo.listaAnime.length; i++) {
    //   if (this.userInfo.listaAnime[i].mal_id == this.miInfoAnime.mal_id) {
    //     existe = true
    //     index = i
    //   }
    // }
    // if (existe) {
    //   this.userInfo.listaAnime[index] = this.miInfoAnime
    // } else {
    //   this.userInfo.listaAnime.push(this.miInfoAnime)
    // }
  }
  addDeleteEpisode(cantidad) {
    console.log(this.miInfoAnime)
    console.log(this.snapshotMiInfoAnime)
    this.miInfoAnime = {
      mal_id: this.anime.mal_id,
      title: this.anime.title,
      watching_status: this.miInfoAnime.watching_status,
      watched_episodes: this.miInfoAnime.watched_episodes += cantidad
    }

  }
  async confirmacionSalida() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Importante!',
      message: 'Estás a punto de salir sin guardar. Si lo haces, perderás todos los cambios que hayas realizado recientemente ¿Deseas continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        },
        {
          text: 'Guardar y salir',
          cssClass: 'secondary',
          handler: (blah) => {
            this.actualizarSalir()
          }
        }, {
          text: 'Salir',
          handler: () => {
            this.navController.back()
          }
        }
      ]
    })
    alert.present()
  }
  async toast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 20000,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }
}
