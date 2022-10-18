import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';
import { StatusBar } from '@capacitor/status-bar';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';


@Component({
  selector: 'app-browser',
  templateUrl: './browser.page.html',
  styleUrls: ['./browser.page.scss'],
})
export class BrowserPage implements OnInit {
  url: string;
  UrlFinal: any;
  @ViewChild('iframe') iframe: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private navigationBar: NavigationBar,
    private androidFullScreen: AndroidFullScreen
  ) { }

  ngOnInit() {
    // this.hideStatusBar()

    this.androidFullScreen.isImmersiveModeSupported()
      .then(() => {
        this.androidFullScreen.immersiveMode()

      }


      )
      .catch(err => console.log(err));


    this.url = this.activatedRoute.snapshot.paramMap.get('url')
    this.UrlFinal = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    // let autoHide: boolean = true;
    // this.navigationBar.setUp(autoHide);

  }
  async ionViewWillLeave() {
    this.androidFullScreen.showSystemUI()
    // await StatusBar.show();
    // console.log('me fui')
    // let autoHide: boolean = false;
    // this.navigationBar.hideNavigationBar()
  }
  hideStatusBar = async () => {
    await StatusBar.hide();
  };
  getOriginUrl() {
    
  }

}
