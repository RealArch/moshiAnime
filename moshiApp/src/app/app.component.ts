import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

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
  ) {
    // SplashScreen.show({
    //   showDuration: 4000,
      
    // });
    this.loading = false 
    this.platform.ready()
      .then(async () => {
        await this.api.initPublicConfigs()
        this.loading = false
        SplashScreen.hide()
      })
  }

}
