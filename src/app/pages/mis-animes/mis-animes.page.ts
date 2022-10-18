import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';

@Component({
  selector: 'app-mis-animes',
  templateUrl: './mis-animes.page.html',
  styleUrls: ['./mis-animes.page.scss'],
})
export class MisAnimesPage implements OnInit {
  todos: any;
  animes: any;
  loading: boolean;
  uid: string;
  listaAnime: any='';
  user: unknown;
  tabActiva = 1
  animesViendo: any;
  animesPlaneados: any;
  animesVistos: any;
  constructor(
    private api: ApiService,
    private streamingMedia: StreamingMedia
  ) { }

  ngOnInit() {
    this.loading = true
    this.api.isLoggedIn()
      .subscribe(user => {
        if (user != null) {
          this.uid = user.uid
          this.api.getUserInfo(this.uid)
            .subscribe((data:any) => {
              this.user = data.payload.data()
              console.log(this.user)
              this.listaAnime = this.user['listaAnime']
              this.cargarAnimes()
              this.loading = false
            }, err => {
              //Toast error
              this.loading = false
            })
        }
      })
  }
  cargarAnimes() {

    this.animesViendo = []
    this.animesVistos = []
    this.animesPlaneados = []

    for (let i = 0; i < this.listaAnime.length; i++) {
      if (this.listaAnime[i].watching_status == 1) {
        this.animesViendo.push(this.listaAnime[i])
      } else if (this.listaAnime[i].watching_status == 6) {
        this.animesPlaneados.push(this.listaAnime[i])
      }
      else if (this.listaAnime[i].watching_status == 2) {
        this.animesVistos.push(this.listaAnime[i])
      }
    }
  }
  // ionViewWillEnter() {

  //   this.api.getUserAnimeList('Rafadini872')
  //   .subscribe(data=>{
  //     if(data['success']){
  //       console.log('okok')
  //         this.todos = data
  //         this.todos = this.todos.data.anime
  //         console.log(this.todos)
  //         this.cargarAnimes(2)
  //     }else{

  //     }
  //   })

  // }
  // ngOnInit() {

  // }
  // cargarAnimes(categoria: number) {
  //   this.animes = []
  //   //2 finalizados
  //   //6 plan to watch
  //   //1 watching 
  //   for (let i = 0; i < this.todos.length; i++) {
  //     if (this.todos[i].watching_status == categoria) {
  //       this.animes.push(this.todos[i])
  //     }
  //   }
  //   console.log(this.animes)
  // }

}
