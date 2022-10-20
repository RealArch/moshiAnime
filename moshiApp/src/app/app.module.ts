import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http'


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { StreamingMedia } from '@awesome-cordova-plugins/streaming-media/ngx';

import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';


import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent],
  imports:
    [BrowserModule,
      HttpClientModule,
      IonicModule.forRoot(),
      AppRoutingModule, provideFirebaseApp(() => initializeApp(environment.firebase)), provideAnalytics(() => getAnalytics()), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
      // AndroidFullScreen,
      // StreamingMedia,
      // GooglePlus,
      // HTTP,
      // InAppBrowser
    ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, ScreenTrackingService, UserTrackingService,
    AndroidFullScreen,
    StreamingMedia,
    GooglePlus,
    HTTP,
    InAppBrowser
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
