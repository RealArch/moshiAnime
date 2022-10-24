const functions = require("firebase-functions");
var admin = require('firebase-admin');
var serviceAccount = require('./moshianimeapp-firebase-adminsdk-75nl9-758b87d251.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
var rp = require('request-promise');
const express = require('express');
const cors = require('cors');
var algolia = require('algoliasearch');
const ALGOLIA_ID = functions.config().algolia.appid;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.apikey;
const client = algolia(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
var db = admin.firestore();
const puppeteer = require('puppeteer');
var app = express();
app.use(cors({ origin: true }));

app.post('/test', async (req, res) => {
    // const promise3 = new Promise(async (resolve, reject) => {
    //     console.log(1)
    //     setTimeout(resolve, 100, 'foo');
    // });
    // Promise.all([promise3]).then((values) => {
    //     console.log('lo hice');
    // });
})
app.post('/', async (req, res) => {
    // var errors = []
    // var data = []
    // try {
    //     const browser = await puppeteer.launch({ headless: false, args: ['--disable-web-security', '--disable-features=IsolateOrigins', ' --disable-site-isolation-trials'] });
    //     const page = await browser.newPage();
    //     await page.goto("https://jkanime.net/,the-daily-life-of-the-inmortal-king-3nd-season/5/", { waitUntil: 'networkidle2' })
    //     var click = await page.click('#btn-show-4')
    //         .catch(err => {
    //             return false
    //         })
    //     if (!click) {
    //         var body = await page.$$eval('body', pElements => pElements.map(el => el.textContent))
    //         console.log(body)
    //         if (body[0] == '...\n') {
    //             console.log('error link')
    //         } else {

    //         }
    //         return res.json({ data: 'err' })

    //     }

    //     await page.click('#btn-show-4')
    //     data = await page.$$eval('iframe', pElements => pElements.map(el => el.innerHTML))
    //     if (data == undefined || data.length == 0) {
    //         errors.push({
    //             anime: 'titulo',
    //             episode: 'numero'
    //         })
    //     }
    //     console.log(data[0])
    //     await browser.close();
    // } catch (error) {
    //     console.log(error)
    // }
    return res.json({ data: 'data[0]', errors: 'errors' })
})
//Obtener links
//OBTENER ANIMES DE TEMPORADA
app.post('/getAnimeVideo', async (req, res) => {
    try {
        var animeId = req.body.animeId
        var episode = req.body.episode
        var anime = await db.collection('animes').doc(animeId).get()
        var formatedTitle = formatName(anime.data().title)
        const browser = await puppeteer.launch(
            {
                headless: true,
                ignoreHTTPSErrors: true,
                slowMo: 0,
                args: [
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-setuid-sandbox',
                    '--no-first-run',
                    '--no-sandbox',
                    '--no-zygote',
                    '--window-size=1280,720',
                ],
                // args: ['--disable-web-security', '--disable-features=IsolateOrigins', ' --disable-site-isolation-trials']
            });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });

        await page.setRequestInterception(true);
        page.on('request', (interceptedRequest) => {
            //'script', 'stylesheet', 'image', 'media', 'font'
          const blockResources = [ 'stylesheet', 'image', 'media', 'font'];
          if (blockResources.includes(interceptedRequest.resourceType())) {
            interceptedRequest.abort();
          } else {
            interceptedRequest.continue();
          }
        });
        
        await page.setUserAgent(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
          );

        await page.goto(`https://jkanime.net/${formatedTitle}/${episode}/`, { waitUntil: 'networkidle2' })
        var iframes = page.mainFrame().childFrames()
        data = await iframes[0].$$eval('video', pElements => pElements.map(el => el.getAttribute('src')))
        await browser.close();
        return res.json({ url: data[0] })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: 'error al leer video', error: error })
    }

})
app.post('/getSetSeasonAnimes', async (req, res) => {
    var season = req.body.season;
    var year = req.body.year;
    executeScalp(season, year)
    return res.json({ success: 'Solicitud enviada. Esta solicitud puede tardar hasta 60 minutos.' })
})
//funcitons
async function executeScalp(season, year) {
    var season = season;
    var year = year;
    var page = 1;
    var has_next_page = true;
    var seasonalAnimes = []
    //leer de la api de jikan
    //leer hasta que no haya mas paginas (obtiene de 25 en 25)
    //si no hay mas paginas "has_next_page": true
    //Inicia pagina en 1
    while (has_next_page == true) {
        let options = {
            uri: `https://api.jikan.moe/v4/seasons/${year}/${season}?page=${page}`,
            json: true
        }
        let res = await rp(options)
        seasonalAnimes.push(...res.data);
        page += 1;
        if (!res.pagination.has_next_page || !res) {
            has_next_page = false
        }
    }
    const batch = db.batch();
    //Preparar data para la DB
    var errors = []
    var emptyAnimes = []
    for (anime of seasonalAnimes) {
        var titleFormated = formatName(anime.title)
        var next = true
        var control = 1
        var urls = []
        while (next) {
            var click = true
            console.log(titleFormated + '  episodio ' + control)
            const browser = await puppeteer.launch({ headless: false, args: ['--disable-web-security', '--disable-features=IsolateOrigins', ' --disable-site-isolation-trials'] });
            const page = await browser.newPage();
            await page.goto(`https://jkanime.net/${titleFormated}/${control}/`, { waitUntil: 'networkidle2' })
            var click = await page.click('#btn-show-4')
                .catch(() => {
                    console.log('entre en error 1')
                    return false
                })
            if (click == false) {
                console.log('ocurrrio un error')
                var body = await page.$$eval('body', pElements => pElements.map(el => el.textContent))
                //si body es ...\n es error en link 
                if (body[0] == '...\n') {
                    console.log('error link')
                    errors.push({
                        anime: titleFormated,
                    })
                }
                console.log('estaba vacio')
                await browser.close();
                next = false
                break
            }
            await page.click('#btn-show-4')
            data = await page.$$eval('iframe', pElements => pElements.map(el => el.outerHTML))
            await browser.close();
            urls.push({
                urls: [`https://jkanime.net${data[0]}`],
                name: null,
                description: null
            })
            control += 1

        }
        if (urls.length == 0) {
            emptyAnimes.push(titleFormated)
        }

        batch.set(db.collection('animes').doc(anime.mal_id.toString()), {
            score: anime.score,
            rank: anime.rank,
            images: anime.images,
            trailer: anime.trailer,
            title: anime.title,
            title_japanese: anime.title_japanese,
            type: anime.type,
            episodes: anime.episodes,
            aired_from: anime.aired.from,
            duration: anime.duration,
            synopsis: anime.synopsis,
            season: anime.season,
            year: anime.year,
            broadcast: anime.broadcast,
            producers: anime.producers,
            studios: anime.studios,
            genres: anime.genres,
            explicit_genres: anime.explicit_genres,
            themes: anime.themes,
            demographics: anime.demographics,
            downloaded_episodes: 0,
            lastUpdate: Date.now(),
            scalpedEpisodes: urls
        })
    };





    //Enviar los errores a la DB para revision
    batch.set(db.collection('statitics').doc('logs'), {
        getSetSeasonAnimes: admin.firestore.FieldValue.arrayUnion({
            date: Date.now(),
            logs: errors,
            emptyAnimes: emptyAnimes
        })
    }, { merge: true })

    // await promise.all(prepareAnime)
    batch.commit()
}


function formatName(title) {
    title = title.replace(/_|#|:|@|!|<>/g, "")
    title = title.replaceAll('(', '').toLowerCase()
    title = title.replaceAll(')', '').toLowerCase()
    title = title.replaceAll('.', '').toLowerCase()
    title = title.replaceAll(',', '').toLowerCase()
    title = title.replaceAll(' ', '-').toLowerCase()

    return title
}

exports.api = functions.runWith({memory:"2GB"}).https.onRequest(app)

exports.animeCreated = functions.firestore
    .document('animes/{animesID}')
    .onCreate(async (snap, context) => {
        //Guardar en algolia
        const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'prod_animes' : 'test_animes';
        const anime = snap.data();
        anime.objectID = snap.id;
        const index = client.initIndex(ALGOLIA_INDEX_NAME);
        index.saveObject(anime);
        return
    })

exports.animeUpdated = functions.firestore
    .document('animes/{animesID}')
    .onUpdate(async (snap, context) => {
        //Guardar en algolia
        const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'prod_animes' : 'test_animes';
        const anime = snap.after.data();
        anime.objectID = snap.after.id;
        const index = client.initIndex(ALGOLIA_INDEX_NAME);
        index.saveObject(anime);
        return
    })