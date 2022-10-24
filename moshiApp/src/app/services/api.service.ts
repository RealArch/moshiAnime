import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment'
import { Auth, authState, getAuth } from '@angular/fire/auth';
import { collectionSnapshots, doc, docData, Firestore, getFirestore, updateDoc } from '@angular/fire/firestore';
import algoliasearch from "algoliasearch"
const client = algoliasearch(environment.algolia.appId, environment.algolia.searchKey)
const animesIndex = client.initIndex(environment.algolia.indexes.animes);

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private _auth: Auth,
    private _firestore: Firestore

  ) { }
  getAnimeVideo(animeId, episode) {
    var data = {
      animeId: animeId,
      episode: episode
    }
    return this.http.post(`${environment.api}api/getAnimeVideo`,data)
  }
  getSeasonAnimes(season, year) {
    return animesIndex.search('', {
      filters: `season:${season} AND year:${year}`
    })
  }
  getAnimeData(id) {
    var ref = doc(getFirestore(), 'animes', id)
    return docData(ref, { idField: id })
  }
  //USUARIO
  isLoggedIn() {
    return authState(getAuth())
    // return this.afAuth.authState
  }
  getUserInfo(uid) {
    var ref = doc(getFirestore(), 'usuarios', uid);
    return docData(ref)
    // return this.firestore.collection('usuarios').doc(uid).snapshotChanges()
  }
  sincronizarConMal(uid, data) {
    var ref = doc(getFirestore(), 'usuarios', uid);
    return updateDoc(ref, {
      listaAnime: data

    })
    // return this.firestore.collection('usuarios').doc(uid).update({
    //   listaAnime:data
    // })
  }
  actualizarLista(uid, data) {
    var ref = doc(getFirestore(), 'usuarios', uid);
    return updateDoc(ref, {
      listaAnime: data

    })
    // return this.firestore.collection('usuarios').doc(uid).update({
    //   listaAnime:data
    // })
  }
  //    
  getFirstList() {
    return this.http.get(`${environment.api}getFirstList`)
  }
  getTopUpcoming() {
    return this.http.get('https://api.jikan.moe/v4/top/anime?filter=upcoming')
  }
  getTopTv() {
    return this.http.get('https://api.jikan.moe/v4/top/anime?type=tv')
  }
  getTopAiring() {
    return this.http.get('https://api.jikan.moe/v4/top/anime?filter=airing')
  }
  getAnimeByMalId(id) {
    return this.http.get(`https://api.jikan.moe/v4/anime/${id}/full`)
  }
  //TIO ANIME
  getAnimeByIdTioAnime(id) {
    return this.http.get(`${environment.api}anime/${id}`)
  }

  //MAL
  getLinkMal() {
    return this.http.get(`${environment.api}loginMal`)
  }
  getMalToken(code, code_challenge, uid) {
    var data = {
      code: code,
      code_challenge: code_challenge,
      udi: uid
    }
    return this.http.post(`${environment.api}getMalToken`, data)
  }
  getUserAnimeList(username) {
    var data = {
      username: username
    }
    console.log(username)
    return this.http.post(`${environment.api}getUserAnimeList`, data)

  }
  //JIKAN
  search(string) {
    //https://api.jikan.moe/v3/search/anime?q=kanojo
    return this.http.get(`https://api.jikan.moe/v4/anime?q=${string}`)

  }
  getStaffByMalId(id_anime) {
    //https://api.jikan.moe/v3/anime/1/characters_staff
    return this.http.get(`https://api.jikan.moe/v4/anime/${id_anime}/characters`)
    //return this.http.post(`${environment.api}getStaffByMalId`,{id_anime:id_anime})

  }
  //SERVIDOR
  test() {
    return this.http.get(`${environment.api}test`)

  }
}
