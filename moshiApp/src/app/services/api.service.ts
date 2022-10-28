import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment'
import { Auth, authState, getAuth, user } from '@angular/fire/auth';
import { collectionSnapshots, doc, docData, Firestore, getFirestore, runTransaction, setDoc, updateDoc } from '@angular/fire/firestore';
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
  getAnimesByIdAlgolia(ids) {
    // if(ids == undefined || ids.length == 0) return []
    return animesIndex.getObjects(ids)
  }
  isFavLocal(favAnimes, animeId) {
    if (favAnimes == undefined) return false
    for (let i = 0; i < favAnimes.length; i++) {
      if (favAnimes[i].animeId == animeId) {
        return true
      }
    }
    return false
  }
  toggleFav(animeId) {
    var currenUid = getAuth().currentUser.uid
    console.log(currenUid)
    var ref = doc(getFirestore(), 'userPublic', currenUid)
    return runTransaction(getFirestore(), async (transaction) => {
      const user = await transaction.get(ref);
      var anime = {
        date: Date.now(),
        animeId: animeId
      }
      var favAnimes = []
      //si no existe favoritos, agregar y finalizar
      if (!user.data().favAnimes) {
        favAnimes.push(anime)
        return transaction.set(ref, {
          favAnimes: favAnimes
        }, { merge: true })
      }
      favAnimes = user.data().favAnimes
      //buscar favoritos y si anime existe en favoritos, eliminar
      for (let i = 0; i < favAnimes.length; i++) {
        if (favAnimes[i].animeId == animeId) {
          favAnimes.splice(i, 1)
          return transaction.set(ref, {
            favAnimes: favAnimes
          }, { merge: true })
        }
      }
      //si no existe en fav, hacer añadir
      favAnimes.push(anime)
      return transaction.set(ref, {
        favAnimes: favAnimes
      }, { merge: true })
    })
  }
  searchTimeAnimeEpisode(episodeId, animeId, viewedAnimes) {
    console.log(episodeId)
    for (let i = 0; i < viewedAnimes.length; i++) {
      if (viewedAnimes[i].animeId == animeId) {
        console.log("encontramos el anime")
        //Luego buscar el id del espisodio
        for (let j = 0; j < viewedAnimes[i].episodes.length; j++) {
          if (viewedAnimes[i].episodes[j].episodeId == episodeId) {
            console.log("encontramos el episodio")
            //calcular porcentaje entre 0 y 1
            return viewedAnimes[i].episodes[j].lastTime
          }
        }
        return 0
      }
    }
    return 0
  }
  getPublicUserData(uid) {
    //get data
    var userUid = getAuth().currentUser.uid
    var ref = doc(getFirestore(), 'userPublic', userUid)
    return docData(ref, { idField: uid })
  }
  updateAnime(userId, time, animeId, episodeId, duration) {
    console.log('duracion: ' + episodeId)
    episodeId = parseInt(episodeId)
    var ref = doc(getFirestore(), 'userPublic', userId)
    return runTransaction(getFirestore(), async (transaction) => {
      const user = await transaction.get(ref);
      //Si no existe userPublic, crearlo
      var viewedAnimes = []
      var dateNow = Date.now()
      console.log('consegui el user')
      //si no existe usuario, o no tiene animes vsitos
      if (!user.exists() || !user.data().viewedAnimes || user.data().viewedAnimes.length == 0) {
        console.log('no existia')
        viewedAnimes = [
          {
            animeId: animeId,
            lastUpdateDate: dateNow,
            episodes: [
              {
                episodeId: episodeId,
                lastTime: time,
                duration: duration,
                lastUpdateDate: dateNow
              }
            ]
          }
        ]
        return transaction.set(ref, {
          viewedAnimes: viewedAnimes
        }, { merge: true })
      }
      //Si si existe el usuario o tiene animes vistos
      viewedAnimes = user.data().viewedAnimes
      //leer todos los viewAnime
      for (let i = 0; i < viewedAnimes.length; i++) {
        //Encontrar nuestro anime
        if (viewedAnimes[i].animeId == animeId) {
          //si esta vacio
          if (viewedAnimes[i].episodes.length == 0) {
            console.log("no encontramos el episodios en la db")
            viewedAnimes[i].episodes.push({
              episodeId: episodeId,
              lastTime: time,
              duration: duration,
              lastUpdateDate: dateNow
            })
            //Guardar la nueva data
            return transaction.set(ref, {
              viewedAnimes: viewedAnimes
            }, { merge: true })
          }
          //si esta lleno            
          //buscamos el episodio
          var episodioEncontrado = false
          for (let j = 0; j < viewedAnimes[i].episodes.length; j++) {
            //si existe, lo actualizamos
            if (viewedAnimes[i].episodes[j].episodeId == episodeId) {
              console.log("encontramos el episodio")
              viewedAnimes[i].episodes[j].lastTime = time;
              viewedAnimes[i].episodes[j].lastUpdateDate = dateNow;
              viewedAnimes[i].episodes[j].duration = duration;
              //Guardar la nueva data
              return transaction.set(ref, {
                viewedAnimes: viewedAnimes
              }, { merge: true })
            }
          }
          //sin no existe, push

          console.log("no encontramos el episodio")
          viewedAnimes[i].episodes.push({
            episodeId: episodeId,
            lastTime: time,
            duration: duration,
            lastUpdateDate: dateNow
          })
          //Guardar la nueva data
          return transaction.set(ref, {
            viewedAnimes: viewedAnimes
          }, { merge: true })
        }
      }
      //no se consiguió el anime en la lista de vistos
      viewedAnimes.push({
        animeId: animeId,
        lastUpdateDate: dateNow,
        episodes: [
          {
            episodeId: episodeId,
            lastTime: time,
            duration: duration,
            lastUpdateDate: dateNow
          }
        ]
      })
      transaction.set(ref, {
        viewedAnimes: viewedAnimes
      }, { merge: true })

      console.log('sin errores')
      console.log(viewedAnimes)


    });
  }
  getAnimeVideo(animeId, episode) {
    var data = {
      animeId: animeId,
      episode: episode
    }
    return this.http.post(`${environment.api}api/getAnimeVideo`, data)
  }
  getSeasonAnimes(season, year) {
    return animesIndex.search('', {
      numericFilters: `totalScraped_sub_esp > 0`,
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
