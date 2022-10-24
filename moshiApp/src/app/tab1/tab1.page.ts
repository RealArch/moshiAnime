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
  slideOpts:SwiperOptions = {
    loop: true,
    initialSlide: 0,
    slidesPerView: 3,
    spaceBetween: 5,
    freeMode:true


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
    this.loadingTv=true
    this.loadingUpcoming=true
    this.loadingAiring=true

    combineLatest([
      this.api.getSeasonAnimes('fall',2022),
      // this.api.getTopTv(),
      // this.api.getTopUpcoming(),
      // this.api.getTopAiring()
    ]).subscribe(([season])=>{//tv,upcoming,airing
      this.season = season.hits
      // this.topTv = tv['data']
      // this.topUpcoming = upcoming['data']
      // this.topAiring = airing['data']
      // this.loading=false
    })
    // this.api.getTopTv()
    //   .subscribe(data => {
    //     this.topTv = data['data']
    //     this.loadingUpcoming=false
    //     console.log(data)
    //   })
    // this.api.getTopUpcoming()
    //   .subscribe(data => {
    //     this.topUpcoming = data['data']
    //     this.loadingTv=false
    //     console.log(this.topUpcoming)

    //   })
    // this.api.getTopAiring()
    //   .subscribe(data => {
    //     this.topAiring = data['data']
    //     this.loadingAiring=false
    //     console.log(this.topAiring)


    //   })

  }
  onSwiper(swiper) {
  }
  onSlideChange(ev) {
  }




}
