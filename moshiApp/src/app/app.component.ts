import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { Platform } from '@ionic/angular';
import { AdMobPlus, BannerAd, InterstitialAd } from '@admob-plus/capacitor'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  loading: boolean;
  constructor(
    public api: ApiService,
    public platform: Platform,
    // public admob: Admob
  ) {
    // (async () => {
    //   const interstitial = new InterstitialAd({
    //     adUnitId: 'ca-app-pub-1815418277361172/7039894954'
        
    //   })
    //   await interstitial.load()
    //   await interstitial.show()
    // })()

    this.loading = true
    this.platform.ready()
      .then(async () => {
        await this.api.initPublicConfigs()
        this.loading = false
      })
  }

}
