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
      console.log('entre a login android google')
      this.auth.loginGoogleAndroid()
        .then((data: any) => {
          console.log('entre a peticion')

          console.log(data)
          this.auth.getUser(data.user.uid)
            .then(user => {
              console.log('encontre datos de user')
              if (user.exists()) {
                console.log('el usuario existia')

                this.rouetr.navigate(['/'])
                this.loading = false

              } else {
                console.log('el no usuario existia')

                //Crea el usuario
                var datos = {
                  uid: data.user.uid,
                  email: data.user.email,
                  nombre: data._tokenResponse.firstName,
                  apellido: data._tokenResponse.lastName,
                  foto: data._tokenResponse.photoUrl,
                }
                this.auth.crearUsuarioFirestore(datos)
                  .then(data => {
                    console.log('cree el usuario')
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
            }).catch(err => {
              console.log('falle al buscar datos')
              console.log(err)
              console.log(12)
              //desloguea
              this.loading = false

              this.auth.logOut()
              //muestra error
              this.toast('Ha ocurrido un problema al iniciar sesión')
            })

        }).catch(err => {
          //mostrar error 
          //muestra error
          console.log(11)
          console.log(err)
          this.loading = false

          this.toast('Ha ocurrido un problema al iniciar sesión con Google')
        })
    } else if (Capacitor.getPlatform() == "web") {
      this.auth.loginGoogleWeb()
        .then((data: any) => {
          this.auth.getUser(data.user.uid)
            .then(user => {

              console.log(user.data())
              console.log(user.exists())
              if (user.exists()) {
                console.log('el usuario existia')
                this.rouetr.navigate(['/'])
                this.loading = false

              } else {
                //Crea el usuario
                console.log(data)
                var datos = {
                  uid: data.user.uid,
                  email: data.user.email,
                  nombre: data._tokenResponse.firstName,
                  apellido: data._tokenResponse.lastName,
                  foto: data._tokenResponse.photoUrl,
                  // nombre: 'testName',
                  // apellido:  'testFamily_name',
                  // foto: 'testPicture',



                }
                this.auth.crearUsuarioFirestore(datos)
                  .then(data => {
                    console.log('cree usuario')
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
            }).catch(err => {
              console.log(err)
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
