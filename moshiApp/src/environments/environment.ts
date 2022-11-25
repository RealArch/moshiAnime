// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var env = 'prod'
export const environment = {
  useEmulators:true,
  production: false,
  // api: 'https://us-central1-moshianimeapp.cloudfunctions.net/',
  api: 'http://localhost:5002/moshianimeapp/us-central1/',

  firebase: {
    apiKey: "AIzaSyBywZj_-QG-2s2E-sU4rq6JIqGmgJ4DKvs",
    authDomain: "moshianimeapp.firebaseapp.com",
    projectId: "moshianimeapp",
    storageBucket: "moshianimeapp.appspot.com",
    messagingSenderId: "1037467696263",
    appId: "1:1037467696263:web:41204b45e3d5c3ddc34c22",
    measurementId: "G-G72FRX517J"
  },
  //ALGOLIA CONFIG
  algolia: {
    appId: '04J5OBYVYJ',
    searchKey: 'a47631b9a0d469934ef61dd22ebaa982',
    indexes: {
      animes: `${env}_animes`,
    }
  }

};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
