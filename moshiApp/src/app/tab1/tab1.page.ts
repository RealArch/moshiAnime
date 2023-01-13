import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { combineLatest } from 'rxjs';
import { Lazy, SwiperOptions } from 'swiper';
import SwiperCore, { Virtual, FreeMode } from 'swiper';

import { AdMobPlus, BannerAd, InterstitialAd } from '@admob-plus/capacitor'


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
      momentumBounce: false,
      minimumVelocity: 0,
      sticky: true
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
  genresRomantic;
  latestUpdated: any;
  genresComedy: any;
  constructor(
    private api: ApiService,
  ) {
    this.loading = true
    this.loadData(null)
    this.addMod()

  }
  addMod(){

    // (async () => {
    //   const banner = new BannerAd({
    //     adUnitId: 'ca-app-pub-3940256099942544/6300978111', 
    //   })
    //   await banner.show()
    
    //   AdMobPlus.addListener('banner.impression', async () => {
    //     // await banner.hide()
    //   })
    // })()


  }
  loadData(ev) {
    //romance  22, comedia 4
    combineLatest([
      this.api.getSeasonAnimes('winter', 2023, ev),
      this.api.getLatestAnimes(ev),
      this.api.getAnimesByCat([22, 4], ev),
      this.api.getAnimesByCat([4], ev),

    ]).subscribe(([season, latestUpdated, genresRomantic, genresComedy]) => {//tv,upcoming,airing
      this.season = season.hits
      //latestUpdated
      this.latestUpdated = latestUpdated.hits
      //Romantic
      this.genresRomantic = genresRomantic.hits
      //Comedy
      this.genresComedy = genresComedy.hits
      if (ev != null) {
        ev.target.complete();
      }
      this.loading = false
    })
  }
  onSwiper(swiper) {
  }
  onSlideChange(ev) {
  }





}
