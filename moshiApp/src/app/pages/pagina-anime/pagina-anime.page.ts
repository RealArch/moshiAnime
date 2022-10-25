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
import { combineLatest } from 'rxjs';

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
  userInfo: any;
  snapshotMiInfoAnime: string;
  miInfoAnime: any = '';
  uid: any;
  actualizando: boolean;
  malId: string;
  animeData: import("@angular/fire/firestore").DocumentData;

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
    // private videoPlayer: VideoPlayer
  ) { }

  ngOnInit() {
    //2 finalizados
    //6 plan to watch
    //1 watching 
    this.uid
    this.loading = true
    var user = getAuth().currentUser
    this.malId = this.activatedRoute.snapshot.paramMap.get('id')
    console.log(user)
    if (user != null) {
      console.log(user)
      combineLatest([
        this.api.getUserInfo(user.uid),
        // this.api.getAnimeByMalId(this.malId),
        // this.api.getStaffByMalId(this.malId),
        this.api.getAnimeData(this.malId)
      ]).subscribe(([userInfo, animeData]) => {
        this.uid = user.uid
        this.userInfo = userInfo
        this.cargarMiAnime(this.userInfo)
        this.servidorActivo = localStorage.getItem('servidorActivo') || 0
        //ANIME MAL
        // this.anime = animeMal['data']

        //ANIMEDATA
        this.animeData = animeData
        console.log(this.animeData)
        //
        this.loading = false

      })
      this.api.getStaffByMalId(this.malId)
        .subscribe(staffMal => {
          //STAFF
          this.characters = staffMal['data']
        })

    }

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
    this.actualizando = true
    this.prepararArray()
    this.api.actualizarLista(this.uid, this.userInfo.listaAnime)
      .then(data => {
        this.actualizando = false
        console.log('si guarde')
        this.toast('Tu perfil ha sido actualizado')

      }).catch(err => {
        this.actualizando = false
        console.log(err)
        this.toast('Ocurrió un error al actualizar el perfil')

      })
  }
  actualizarSalir() {
    this.actualizando = true
    this.prepararArray()
    console.log('entre a actualizar')
    this.api.actualizarLista(this.uid, this.userInfo.listaAnime)
      .then(data => {
        this.actualizando = false
        console.log('si guarde')
        this.toast('Tu perfil ha sido actualizado')
        this.navController.back()
      }).catch(err => {
        this.toast('Ocurrió un error al actualizar el perfil')

        this.actualizando = false
        console.log(err)
      })
  }
  prepararArray() {
    var existe = false
    var index
    for (let i = 0; i < this.userInfo.listaAnime.length; i++) {
      if (this.userInfo.listaAnime[i].mal_id == this.miInfoAnime.mal_id) {
        existe = true
        index = i
      }
    }
    if (existe) {
      this.userInfo.listaAnime[index] = this.miInfoAnime
    } else {
      this.userInfo.listaAnime.push(this.miInfoAnime)
    }
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
      duration: 5000,
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
