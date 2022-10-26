import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { SearchPage } from '../pages/search/search.page';
import { combineLatest } from 'rxjs';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  topTv: any;
  slideOpts: SwiperOptions = {
    initialSlide: 0,
    slidesPerView: 3,
    spaceBetween: 5,
    freeMode: true


  };
  topUpcoming: any;
  topAiring: any;
  swiper: Promise<any>;
  loadingTv: boolean;
  loadingUpcoming: boolean;
  loadingAiring: boolean;
  loading: boolean;
  season: any;
  constructor(
    private api: ApiService,
  ) {
    this.loadingTv = true
    this.loadingUpcoming = true
    this.loadingAiring = true

    combineLatest([
      this.api.getSeasonAnimes('fall', 2022),
    ]).subscribe(([season]) => {//tv,upcoming,airing
      this.season = season.hits
      console.log(this.season)
    })


  }
  onSwiper(swiper) {
  }
  onSlideChange(ev) {
  }




}
