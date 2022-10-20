import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loading: boolean;

  constructor(
    private auth: AuthService,
    private rouetr: Router,
    private toastController: ToastController

  ) { }
  ionViewWillEnter() {
    this.auth.isLogged().subscribe(data => {
      if (data != null) {
        this.rouetr.navigate([''])
      }
    })
  }
  ngOnInit() {
  }
  google() {
    this.loading = true
    if (Capacitor.getPlatform() == "android") {
      this.auth.loginGoogleAndroid()
        .then((data:any) => {
          console.log(data)
          this.auth.getUser(data.user.uid)
            .then(user=>{
              if (user.exists) {
                this.rouetr.navigate(['/'])
                this.loading = false

              } else {
                //Crea el usuario
                var datos = {
                  uid: data.user.uid,
                  email: data.user.email,
                  nombre: data.additionalUserInfo.profile['given_name'],
                  apellido: data.additionalUserInfo.profile['family_name'],
                  foto: data.additionalUserInfo.profile['picture'],
                  listaAnime: [],
                  malSync: false
                }
                this.auth.crearUsuarioFirestore(datos)
                  .then(data => {
                    this.loading = false

                    this.rouetr.navigate(['/'])
                  }).catch(data => {
                    this.loading = false

                    //desloguea
                    this.auth.logOut()
                    //muestra error
                    this.toast('Ha ocurrido un problema al iniciar sesión')
                  })
              }
            }).catch(err=>{
               //desloguea
               this.loading = false

               this.auth.logOut()
               //muestra error
               this.toast('Ha ocurrido un problema al iniciar sesión')
            })
   
        }).catch(err => {
          //mostrar error 
          //muestra error
          this.loading = false

          this.toast('Ha ocurrido un problema al iniciar sesión con Google')
        })
    } else if (Capacitor.getPlatform() == "web") {
      this.auth.loginGoogleWeb()
        .then((data:any) => {
          console.log(data)
          this.auth.getUser(data.user.uid)
          .then(user=>{
            if (user.exists) {
              this.rouetr.navigate(['/'])
              this.loading = false

            } else {
              //Crea el usuario
              var datos = {
                uid: data.user.uid,
                email: data.user.email,
                nombre: data.additionalUserInfo.profile['given_name'],
                apellido: data.additionalUserInfo.profile['family_name'],
                foto: data.additionalUserInfo.profile['picture'],
                listaAnime: [],
                malSync: false

              }
              this.auth.crearUsuarioFirestore(datos)
                .then(data => {
                  this.loading = false

                  this.rouetr.navigate(['/'])
                }).catch(data => {
                  this.loading = false

                  //desloguea
                  this.auth.logOut()
                  //muestra error
                  this.toast('Ha ocurrido un problema al iniciar sesión')
                })
            }
          }).catch(err=>{
              //desloguea
              this.loading = false

              this.auth.logOut()
              //muestra error
              this.toast('Ha ocurrido un problema al iniciar sesión')
          })

        }).catch(err => {
          //mostrar error 
          //muestra error
          this.loading = false

          this.toast('Ha ocurrido un problema al iniciar sesión con Google')
        })
    }

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
