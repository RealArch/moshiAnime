import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { combineLatest } from 'rxjs';
import { Lazy, SwiperOptions } from 'swiper';
import SwiperCore, { Virtual, FreeMode } from 'swiper';
SwiperCore.use([FreeMode, Lazy,]);
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
    freeMode: {
      enabled: true,
      momentumRatio: 0.6,
      momentumVelocityRatio: 0.5,
      momentumBounce:false,
      minimumVelocity:0,
      sticky:true
    },
    lazy: true

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
    this.loading = true


    combineLatest([
      this.api.getSeasonAnimes('fall', 2022),
    ]).subscribe(([season]) => {//tv,upcoming,airing
      this.season = season.hits
      console.log(this.season)
      this.loading = false
    })
  }

  onSwiper(swiper) {
  }
  onSlideChange(ev) {
  }




}
