const cron = require("node-cron");
const express = require("express");
var rp = require('request-promise');

const app = express();
//cron.schedule("0 0 0,9,12,2,4,8,10 * * *", async function () {

cron.schedule("0 0 0,9,14,20,22 * * *", async function () {
  console.log("---------------------");
  console.log("Ejecutando");
  var options = {
    method: 'POST',
    uri: 'http://localhost:5001/moshianimeapp/us-central1/api/getSetSeasonAnimes',
    body: {
      season: 'fall',
      year: 2022
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