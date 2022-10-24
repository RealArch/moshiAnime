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
import { VideoPlayer } from '@ionic-native/video-player/ngx';

import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';


import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideFirestore, getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from '@angular/fire/firestore';
import { SwiperModule } from 'swiper/angular';

// import { VgCoreModule } from '@videogular/ngx-videogular/core';
// import { VgControlsModule } from '@videogular/ngx-videogular/controls';
// import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
// import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

@NgModule({
  declarations: [AppComponent],
  imports:
    [
      // VgCoreModule,
      // VgControlsModule,
      // VgOverlayPlayModule,
      // VgBufferingModule,
      SwiperModule,
      BrowserModule,
      HttpClientModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAnalytics(() => getAnalytics()),
      provideAuth(() => {
        // if (environment.useEmulators) {
        //   const fireauth = getAuth();
        //   connectAuthEmulator(fireauth, 'http://localhost:9099');
        //   return fireauth;
        // } else { 
          return getAuth(); 
        // }
      }),
      provideFirestore(() => {
        // if (environment.useEmulators) {

        //   const firestore = getFirestore();
        //   connectFirestoreEmulator(firestore, 'localhost', 8080);
        //   return firestore;
        // } else {
          return getFirestore();
        // }
      }),

    ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, ScreenTrackingService, UserTrackingService,
    AndroidFullScreen,
    StreamingMedia,
    GooglePlus,
    HTTP,
    InAppBrowser,
    VideoPlayer
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
