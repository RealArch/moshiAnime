import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  loading: boolean;
  constructor(
    public api: ApiService,
    public platform: Platform
  ) {
    //Init public configs
    this.loading = true
    this.platform.ready()
      .then(async () => {
        await this.api.initPublicConfigs()
        this.loading = false
      })
  }

}
