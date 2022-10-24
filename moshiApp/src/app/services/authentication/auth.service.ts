import { Injectable } from '@angular/core';

import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { Auth, authState, getAuth, GoogleAuthProvider, signInWithCredential, signInWithPopup, signOut } from '@angular/fire/auth';
import { doc, Firestore, getDoc, getFirestore, setDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _auth: Auth,
    private _firebase: Firestore,
    private googlePlus: GooglePlus

  ) { }
  getUser(uid) {
    console.log(uid)
    var ref = doc(getFirestore(), 'usuarios', uid);
    return getDoc(ref)
  }
  logOut() {
    return signOut(getAuth())
  }
  loginGoogleWeb() {
    return signInWithPopup(getAuth(), new GoogleAuthProvider())
    // return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
  }
  async loginGoogleAndroid() {
    //return this.afUth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    const res = await this.googlePlus.login({
      'webClientId': "1037467696263-6abvsqlmsknkd8uji0a2oo3ae9n757g5.apps.googleusercontent.com",
      'offline': true
    });
    return signInWithCredential(getAuth(), GoogleAuthProvider.credential(res.idToken))
    // return this.afAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken));
  }
  crearUsuarioFirestore(datos) {
    var ref = doc(getFirestore(), 'usuarios', datos.uid);
    return setDoc(ref, datos
    )
    // return this.firestore.collection('usuarios').doc(datos.uid).set(datos)
  }
  logout() {
    return signOut(getAuth())

  }
  isLogged() {
    return authState(getAuth())
    // return this.afAuth.authState
  }
}
