var env = 'prod'
export const environment = {
  production: true,
  useEmulators:false,
  firebase: {
    apiKey: "AIzaSyBywZj_-QG-2s2E-sU4rq6JIqGmgJ4DKvs",
    authDomain: "moshianimeapp.firebaseapp.com",
    projectId: "moshianimeapp",
    storageBucket: "moshianimeapp.appspot.com",
    messagingSenderId: "1037467696263",
    appId: "1:1037467696263:web:41204b45e3d5c3ddc34c22",
    measurementId: "G-G72FRX517J"
  },
  api: 'https://us-central1-moshianimeapp.cloudfunctions.net/',
    //ALGOLIA CONFIG
    algolia: {
      appId: '04J5OBYVYJ',
      searchKey: 'a47631b9a0d469934ef61dd22ebaa982',
      indexes: {
        animes: `${env}_animes`,
      }
    }

};
