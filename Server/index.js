const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const app = express();
const { Mal, Jikan } = require("node-myanimelist");
const API = require("@chris-kode/myanimelist-api-v2");
const auth = Mal.auth("0183b25d46ab773276e704b704a2cecc" /* app_id */);
const oauth = new API.OAUTH('0183b25d46ab773276e704b704a2cecc');
const pkceChallenge = require('pkce-challenge')
const pkce = pkceChallenge();
var admin = require('firebase-admin');
var serviceAccount = require("./moshianimeapp-firebase-adminsdk-75nl9-758b87d251.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "moshianimeapp.appspot.com",
});
var db = admin.firestore();

const got = require('got');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var cheerio = require('cheerio')
var axios = require('axios');

const animeapi = require('@justalk/anime-api');
const request = require('request');

const puppeteer = require('puppeteer');

// const url = auth.getOAuthUrl(pkce.code_challenge);
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
});
//const api = require('./routes/api');
app.use(morgan('dev'));
const { getLastest, getEmision, getGenders, getLetters, getCategories, animeSearch, getAnime, getAnimes, getEpisode, getBy, ovaSearch } = require('./controller');



const port = process.env.PORT || 3000;
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));
app.get('/', async (req, res) => {
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://tioanime.com/ver/pokemon-267');
        // await page.screenshot({ path: 'example.png' });
        let twitterFrame // this will be populated later by our identified frame

        for (const frame of page.mainFrame().childFrames()) {
            // Here you can use few identifying methods like url(),name(),title()
            if (frame.url().includes('streamium')) {
                console.log('we found the Twitter iframe')
                twitterFrame = frame
                console.log(frame.url())
                // we assign this frame to myFrame to use it later
            }
        }

        await browser.close();
    })();

    res.json({ data: 'anime' })

})
app.post('/getUserAnimeList', async (req, res) => {
    var body = req.body
    console.log(body.username)
    var userList = await Jikan.user(req.body.username).animelist().all()
    res.json({ success: true, data: userList })
})
app.get('/test', async (req, res) => {
    var options = {
        url: 'https://api.myanimelist.net/v2/users/@me',
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY2ODcxMWU2NWZlNjc4ZmI4OWY1MjAyZTQyY2YwZjkxZDhmYmFlNzg2NWI0YmMzMjk3MGUzOTA2N2ZiZDNmMjkyY2FjNjU3M2I5ZWM5NTYxIn0.eyJhdWQiOiIwMTgzYjI1ZDQ2YWI3NzMyNzZlNzA0YjcwNGEyY2VjYyIsImp0aSI6IjY2ODcxMWU2NWZlNjc4ZmI4OWY1MjAyZTQyY2YwZjkxZDhmYmFlNzg2NWI0YmMzMjk3MGUzOTA2N2ZiZDNmMjkyY2FjNjU3M2I5ZWM5NTYxIiwiaWF0IjoxNjE2MTE5Mzg1LCJuYmYiOjE2MTYxMTkzODUsImV4cCI6MTYxODc5Nzc4NSwic3ViIjoiOTkzNzEwNSIsInNjb3BlcyI6W119.IZaqu8c5x7KIc7gfz0lUOPByDpggWrQyMsfjsggB0Jvj7HRsLW57q_GZ4sPBm0oJ-vYP5oDnSz3YSPXCvyIrkvg18Z36jjSG6SXu8uhmWLh2242_ZQcnZT-BofZvezwLtOCnqoFGem_Gu6gLffJCpqNL6hNgtAMQbdfSM3RlhHx6OrRAPR3bPCCVHsi_-xdTouDp9IGLNjq9lV8y-ITTwqhxNN6IOCGnaaRDd7ApU1bbvxE2JwPLbKyXurVdYG95D-jO7aT0ar_c0HszxYHU2zJwptGaluyT_3PHJosMRLfo8AsOiXGma-MgKovM0QwsEjnHkSFwa1cpiuySzerc9Q',
        }
    }
    var data
    request.get(options, async (err, resp, body) => {
        data = JSON.parse(resp.body)
        var animelist = await Jikan.user(data.name).animelist().all()
        return res.json({ data: animelist })
    })


})
app.get('/loginMal', async (req, res) => {
    var challenge = pkce.code_challenge
    const url = auth.getOAuthUrl(challenge);
    return res.json({ url: url, code_challenge: challenge })
})
app.post('/getMalToken', async (req, res) => {
    var body = req.body
    const uid = req.body.uid
    var tokens
    var listaFinal = []
    await oauth.accessToken(body.code, body.code_challenge).then(data => {
        tokens = data
    }).catch(err => {
        console.log(err)
        return res.json({ err: err })
    })
    //obtener lista de animes y guardarlos en firestore
    var options = {
        url: 'https://api.myanimelist.net/v2/users/@me',
        headers: {
            'Authorization': 'Bearer ' + tokens.access_token,
        }
    }
    var data
    request.get(options, async (err, resp, body) => {
        data = JSON.parse(resp.body)
        var animelist = await Jikan.user(data.name).animelist().all()
        animelist = animelist.anime
        for (let i = 0; i < animelist.length; i++) {
            listaFinal.push({
                mal_id: animelist[i].mal_id,
                title: animelist[i].title,
                watching_status: animelist[i].watching_status,
                watched_episodes: animelist[i].watched_episodes
            })
        }


        return res.json({ success: true, data: listaFinal })
    })


})
app.get('/node/:code', async (req, res) => {

})
app.get('/getFirstList', async (req, res) => {
    let searchIDC = await Jikan.top.anime(1)

    // let parsedUrl = url.parse(searchIDC);
    // let query = querystring.parse(parsedUrl.query);
    // // let searchIDC = await acount.manga.search(
    // //     "Sakurasou",
    // //     Mal.Manga.fields().all()
    // //  ).call();
    // console.log(query)
    return res.json({ data: searchIDC })

})
app.get('/query', async (req, res) => {
    //https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=0183b25d46ab773276e704b704a2cecc&code_challenge_method=plain&code_challenge=EQPg5XQP0Ickxzg84NBxwR6TYReHeA-o7YzAIf3xIlA

    res.send(req.query)
})
app.get('/search', async (req, res) => {
    console.log(req.query)
    var a = await Jikan.search().anime({ q: req.query.q })
    return res.json(a)
})

//app.use('/api', api);
app.post('/getStaffByMalId', async (req, res) => {
    console.log(req.body)
    var a = await Jikan.anime(req.body.id_anime).charactersStaff()
    return res.json({ data: a })
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})