import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {HttpClientModule} from '@angular/common/http'

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {HTTP} from '@ionic-native/http/ngx'
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';


import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    

  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },InAppBrowser,GooglePlus,HTTP,
    StreamingMedia,NavigationBar,AndroidFullScreen

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
