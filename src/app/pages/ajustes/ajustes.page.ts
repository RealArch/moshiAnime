import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/authentication/auth.service';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router,
    private api: ApiService,
    private iab: InAppBrowser,
    private toastController:ToastController
  ) { }

  ionViewWillEnter(){

  }
  ngOnInit() {
    
  }
  logout() {
    this.auth.logout()
      .then(() => {
        this.router.navigate(['login'])
      })
  }
  goToMal() {
    var code_challenge
    var code
    this.api.getLinkMal()
      .subscribe(data => {
  
        code_challenge = data['code_challenge']
        localStorage.setItem('code_challenge', data['code_challenge'])
        
        const browser = this.iab.create(data['url'], '_blank', {
          location: 'no',
          zoom: 'no',
        })
        browser.on('loadstop').subscribe(
          data => {
            let url = data.url;
            code = this.getParameterByName('code', url); // "lorem"
            if (code != null) {

              browser.close()

            }
          },err=>{
            this.toast('Ha ocurrido un problema al sincronizar. Intenta nuevamente')
          })
        browser.on('exit')
          .subscribe(() => {
            console.log('me fui')
            this.getMalToken(code, code_challenge)

          },err=>{
            this.toast('Ha ocurrido un problema al sincronizar. Intenta nuevamente')
          })
        //              


      }, err => {
        this.toast('Ha ocurrido un problema al sincronizar. Intenta nuevamente')
        console.log(err)
      })
  }
  getMalToken(code, code_challenge) {
    this.auth.isLogged()
    .subscribe(user=>{
      
      if(user != null){
        this.api.getMalToken(code, code_challenge, user.uid)
      .subscribe((data) => {
        if(data['success']){
            console.log(data['data'])
            this.api.sincronizarConMal(user.uid,data['data'])
            .then(data=>{
              this.toast('Sincronizacion completa')
            }).catch(err=>{
              this.toast('Ha ocurrido un problema al sincronizar. Intenta nuevamente')
            })
            
        }else{
          this.toast('Ha ocurrido un problema al sincronizar. Intenta nuevamente')

        }
        // var mal_access_token=JSON.stringify(tokens['tokens']['access_token'])
        // var mal_refresh_token=JSON.stringify(tokens['tokens']['refresh_token'])
        // console.log(mal_access_token)
        // localStorage.setItem('mal_access_token',mal_access_token)
        // localStorage.setItem('mal_refresh_token',mal_refresh_token)
        //Enviar notificacion de sincronizacion

      }, (err) => {
        this.toast('Ha ocurrido un problema al sincronizar. Intenta nuevamente')
        console.log(err)
      })
      }else{
        this.toast('No encontramos una sesión activa')

      }
    },err=>{
      this.toast('Ha ocurrido un problema al sincronizar. Intenta nuevamente')

    })
    
  }
  getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  async toast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 5000,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }
}
