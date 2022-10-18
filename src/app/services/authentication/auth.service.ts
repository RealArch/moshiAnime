import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore'
import firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private googlePlus: GooglePlus

  ) { }
  getUser(uid) {
    return this.firestore.collection('usuarios').doc(uid).get()
  }
  logOut() {
    return this.afAuth.signOut()
  }
  loginGoogleWeb() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
  }
  async loginGoogleAndroid() {
    //return this.afUth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    const res = await this.googlePlus.login({
      'webClientId': "1037467696263-6abvsqlmsknkd8uji0a2oo3ae9n757g5.apps.googleusercontent.com",
      'offline': true
    });
    return this.afAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken));
  }
  crearUsuarioFirestore(datos) {
    console.log(datos)
    return this.firestore.collection('usuarios').doc(datos.uid).set(datos)
  }
  logout() {
    return this.afAuth.signOut()
  }
  isLogged() {
    return this.afAuth.authState
  }
}
