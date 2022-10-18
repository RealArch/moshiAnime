import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { SearchPage } from '../pages/search/search.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  topTv: any;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 3,
    spaceBetween: 5,
    freeMode: true,
    lazyLoading: false,
    freeModeMomentumBounce: false,
    resistance: false,



  };
  topUpcoming: any;
  topAiring: any;
  swiper: Promise<any>;
  loadingTv: boolean;
  loadingUpcoming: boolean;
  loadingAiring: boolean;
  constructor(
    private api: ApiService,
  ) {
    this.loadingTv=true
    this.loadingUpcoming=true
    this.loadingAiring=true

    this.api.getTopTv()
      .subscribe(data => {
        this.topTv = data['top']
        this.loadingUpcoming=false
      })
    this.api.getTopUpcoming()
      .subscribe(data => {
        this.topUpcoming = data['top']
        this.loadingTv=false
      })
    this.api.getTopAiring()
      .subscribe(data => {
        this.topAiring = data['top']
        this.loadingAiring=false

      })

  }




}
