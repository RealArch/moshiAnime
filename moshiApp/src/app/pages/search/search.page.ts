import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonSearchbar, ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';



@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild('mainSearchbar') searchBar: IonSearchbar;

  animes
  loading: boolean;
  animesFinal: any;
  searchString: any;
  noMore: boolean;
  page: number = 0;

  constructor(
    private modal: ModalController,
    private api: ApiService,
    private navController: NavController,
  ) { }

  ngOnInit() {

  }
  ionViewDidEnter() {
    setTimeout(() => {
      this.searchBar.setFocus();
    }, 150);
  }
  close() {
    this.navController.back()
  }
  async search(ev) {
    this.searchString = ev.detail.value
    this.loading = true
    this.animesFinal = []
    await this.getData(null)
    this.loading = false
    // this.api.search(ev.detail.value, 0)
    //   .then(data => {
    //     console.log(data)
    //     this.animesFinal = data.hits
    //     this.loading = false

    //   }).catch(err => {
    //     console.log(err)
    //   })


  }
  async getData(ev) {
    try {
      var animeData = await this.api.search(this.searchString, this.page)
      this.animesFinal.push(...animeData.hits)
      if (ev != null) {
        ev.target.complete();
      }
      if (animeData.hits.length == 0) {
        this.noMore = true
      }
      this.page += 1

    } catch (error) {

    }



  }
}
