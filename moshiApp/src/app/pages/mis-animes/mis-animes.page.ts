import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

import { StreamingMedia } from '@awesome-cordova-plugins/streaming-media/ngx';
import { Subscription } from 'rxjs';
import { PopupsService } from 'src/app/services/popups/popups.service';

@Component({
  selector: 'app-mis-animes',
  templateUrl: './mis-animes.page.html',
  styleUrls: ['./mis-animes.page.scss'],
})
export class MisAnimesPage implements OnInit {
  todos: any;
  favAnimes: any;
  loading: boolean;
  uid: string;
  listaAnime: any = '';
  user: unknown;
  tabActiva = 'fav'
  animesViendo: any;
  animesPlaneados: any;
  animesVistos: any;
  subs: Subscription[] = [];
  constructor(
    private api: ApiService,
    private apiPopups: PopupsService
  ) { }

  async ngOnInit() {
    this.loading = true
    this.subs.push(
      this.api.getPublicUserData(null)
        .subscribe(async data => {
          await this.cargarAnimes(data.favAnimes)
          console.log(this.favAnimes)
          this.loading = false
        }, err => {
          this.apiPopups.toast('danger', 'No hemos podido cargar los datos. Intenta nuevamente')
          console.log(err)
        })
    )
  }
  async cargarAnimes(favAnimes) {
    var uids = []
    console.log(favAnimes)
    for (const fav of favAnimes) {
      uids.push(fav.animeId)
    }
    return await this.api.getAnimesByIdAlgolia(uids)
      .then(data => {
        this.favAnimes = data.results
      }).catch(err => {
        this.apiPopups.toast('danger', 'No hemos podido cargar los datos. Intenta nuevamente')
        console.log(err)
      })
  }
  // async handleRefresh(event, favAnimes) {
  //   console.log(favAnimes)

  //     // Any calls to load data go here
  //     await this.cargarAnimes(favAnimes)
  //     event.target.complete();

  // };
  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

}
