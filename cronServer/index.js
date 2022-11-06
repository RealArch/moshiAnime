const cron = require("node-cron");
const express = require("express");
var rp = require('request-promise');

const app = express();
//cron.schedule("0 0 0,9,12,2,4,8,10 * * *", async function () {

cron.schedule("0 0 0,10,12,14,15,17,21 * * *", async function () {
  console.log("---------------------");
  console.log("Ejecutando");
  var options = {
    method: 'POST',
    //https://us-central1-moshianimeapp.cloudfunctions.net/
    //http://localhost:5002/moshianimeapp/us-central1/api/getSetSeasonAnimes
    uri: 'https://us-central1-moshianimeapp.cloudfunctions.net/api/getSetSeasonAnimes',
    body: {
      season: 'fall',
      year: 2022,
      actualSeason: true,
      dateNowSus: null
    },
    json: true // Automatically stringifies the body to JSON
  };
  console.log('haciendo llamada')
  await rp(options)
    .then(function (parsedBody) {
      console.log('ok')
    })
    .catch(function (err) {
      console.log('error')
      console.log(err)

    });
  return
});
//PRIMER DIA
//9 = 3
//21 = 8
//SEGUNDO DIA
//0 = 0
//9 = 0
//2 = 9
//6 = 0
//9 = 0
//TERCER DIA
//0 = 0
//9 = 0
//12 =0
//14 = 0
//18 = 1
//21 = 0

// app.get('/', async(req,res)=>{
//   console.log("---------------------");
//   console.log("Ejecutando");
//   var options = {
//     method: 'POST',
//     uri: 'http://localhost:5001/moshianimeapp/us-central1/api/getSetSeasonAnimes',
//     body: {
//       season: 'fall',
//       year: 2022
//     },
//     json: true // Automatically stringifies the body to JSON
//   };
//   console.log('haciendo llamada')
//   await rp(options)
//     .then(function (parsedBody) {
//       console.log('ok')
//     })
//     .catch(function (err) {
//       console.log('error')
//       console.log(err)

//     });
//   return
// })





app.listen(3000, () => {
  console.log("application listening.....");
});