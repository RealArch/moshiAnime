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

app.get('/test', async (req, res) => {
    var statitics = await db.collection('statitics').doc('publicConfigs').get()
    var array = statitics.data().addedSeasons
    var moving = array.splice(array.length - 1, 1)[0]
    array.unshift(moving)
    console.log(array)
    await db.collection('statitics').doc('publicConfigs').update({
        addedSeasons: array
    })
    //    var cats = await db.collection('categories').get()
    //     cats.forEach(cat => {
    //         const ALGOLIA_INDEX_NAME = 'prod_categories';
    //         const algoliaCat = cat.data();
    //         algoliaCat.objectID = cat.id;
    //         const index = client.initIndex(ALGOLIA_INDEX_NAME);
    //         index.saveObject(algoliaCat);

    //     });
    //     return res.json('ok')
})
app.get('/', async (req, res) => {
    //Actualizar categories
    //leer todos los animes
    var dataANimes = await db.collection('animes').where('season', '==', 'summer').get()
    //Existe la categoria?
    var animes = []
    dataANimes.forEach(anime => {
        animes.push({
            data: anime.data(),
            id: anime.id
        })
    });
    console.log('conte: ' + animes.length)
    for (const anime of animes) {
        console.log(anime.data.title)
        var categories = []
        for (const genre of anime.data.genres) {
            categories.push(genre.mal_id)
        }
        await db.collection('animes').doc(anime.id).update({
            categories: categories
        })
        // for (const genre of anime.data.genres) {
        //     //leer la categoria
        //     console.log(genre.mal_id)
        //     var cat = await db.collection('categories').doc(genre.mal_id.toString()).get()
        //     //si no existe, se crea
        //     if (!cat.exists) {
        //         await db.collection('categories').doc(genre.mal_id.toString()).set({
        //             name: genre.name,
        //             count: 1
        //         })

        //         continue
        //     }
        //     //Si existía
        //     console.log('si existia')
        //     await db.collection('categories').doc(genre.mal_id.toString()).update({
        //         count: admin.firestore.FieldValue.increment(1)
        //     })


        // }
    }



    return res.json({ data: 'data[0]', errors: 'errors' })
})
//Obtener links
//OBTENER ANIMES DE TEMPORADA
app.post('/getAnimeVideo', async (req, res) => {
    try {
        var animeId = req.body.animeId
        var episode = req.body.episode
        var anime = await db.collection('animes').doc(animeId).get()
        var formatedTitle = formatName(anime.data().titleFormated)
        const browser = await puppeteer.launch(
            {
                headless: true,
                ignoreHTTPSErrors: true,
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
            const blockResources = ['stylesheet', 'image', 'media', 'font'];
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
        if (data[0] == undefined) {
            return res.status(500).json({ msg: 'error al leer video', error: error })

        }
        return res.json({ url: data[0] })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: 'error al leer video', error: error })
    }

})
app.post('/getSetSeasonAnimes', async (req, res) => {
    console.log('entre')
    var season = req.body.season;
    var year = req.body.year;
    var actualSeason = req.body.actualSeason
    var dateNowSus = req.body.dateNowSus
    //si es local quitar el await
    await executeScalp(season, year, actualSeason, dateNowSus)
    return res.json({ success: 'Solicitud enviada. Esta solicitud puede tardar hasta 60 minutos.' })
})
//funcitons
async function executeScalp(season, year, isActualSeason, dateNowSus) {
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

    // seasonalAnimes.splice(0, 26)
    // seasonalAnimes.splice(20)
    const batch = db.batch();
    //Preparar data para la DB
    var errors = []
    var emptyAnimes = []
    var finalizedAnimeCount = 0
    var completedAnimes = []
    var successScraps = 0
    var metaDataErrors = []
    //Leer los rezagados
    //LAGGARD
    var publicConfigs = await db.collection('statitics').doc("publicConfigs").get()
    var actualSeason = publicConfigs.data().actualSeason
    var laggardAnimes = publicConfigs.data().laggardAnimes
    //Añadir aqui a la lista, los laggardAnimes si hay, y si estamos en la season actual
    console.log(laggardAnimes.length)
    if (laggardAnimes.length > 0 && actualSeason.season == season && actualSeason.year == year) {
        try {
            //leer de algolia los laggards
            // const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'prod_animes' : 'test_animes';
            const ALGOLIA_INDEX_NAME = 'prod_animes';

            const index = client.initIndex(ALGOLIA_INDEX_NAME);
            var algoliaLaggardsAnimes = await index.getObjects(laggardAnimes)
            //Inyectar los datos al array de animes a buscar y añadimos mal_id
            for (let i = 0; i < algoliaLaggardsAnimes.results.length; i++) {
                algoliaLaggardsAnimes.results[i].mal_id = algoliaLaggardsAnimes.results[i].objectID
                seasonalAnimes.push(algoliaLaggardsAnimes.results[i])
            }
            console.log('habían laggards en la DB')

        } catch (error) {
            console.log(error)
        }

    }
    for (anime of seasonalAnimes) {
        var animeMetadataErrors = []
        var metadataAnime
        var control = 1
        var titleFormated = formatName(anime.title)
        console.log()
        console.log('Iniciamos: ' + titleFormated)
        var urls = []
        var exists = false
        var lastUpdateDate = Date.now()

        //Si el anime existe en nuestra DB, lee los episodios scalpedEpisodes.
        //Inicia busqueda desde el ultimo. control = scrapped.length + 1
        var dbAnime = await db.collection('animes').doc(anime.mal_id.toString()).get()
        if (dbAnime.exists) {
            exists = true
            control = dbAnime.data().scrapedEpisodes.sub_esp.length + 1;
            titleFormated = dbAnime.data().titleFormated;
            console.log(titleFormated)
            lastUpdateDate = dbAnime.data().lastUpdate;
            urls = dbAnime.data().scrapedEpisodes.sub_esp;
            //si scrapedEpisodes.sub_esp.length >= anime.episodes && ya no esta en airign, break
            if (anime.episodes != null) {
                if ((dbAnime.data().scrapedEpisodes.sub_esp.length >= anime.episodes)) {
                    console.log('Anime finalizado y Scrap completo')
                    finalizedAnimeCount += 1
                    console.log(`${finalizedAnimeCount}/${seasonalAnimes.length} animes completados`)
                    completedAnimes.push(titleFormated)

                    //Verificar si estaba en laggardAnimes para eliminarlo
                    for (let i = 0; i < laggardAnimes.length; i++) {
                        if (laggardAnimes[i] == anime.mal_id) {
                            //si encontramos el anime en laggard, lo eliminamos y actualizamos
                            laggardAnimes.splice(i, 1)
                            batch.update(db.collection('statitics').doc('publicConfigs'), {
                                laggardAnimes: laggardAnimes
                            })
                            break
                        }

                    }
                    continue
                }
            }

        }
        // LEER DATA DE TITULO Y SYNOPIS DE ANIME


        let options = {
            uri: `https://api.jikan.moe/v4/anime/${anime.mal_id}/episodes`,
            json: true
        }
        var metaDataTries = 1
        while (metaDataTries < 5) {
            try {
                let timeout = new Promise(async function (resolve, reject) {
                    try {
                        var time = setTimeout(function () { reject(false) }, 4000);
                        resolve(await rp(options))
                        clearTimeout(time)
                    } catch (error) {
                    }
                });
                var dat = await Promise.race([timeout])
                console.log('consegui metadata')
                // let res = await rp(options)
                metadataAnime = dat.data
                //PENDIENTEm Implementar paginas para animes con mas de 100 epis.
                metaDataTries = 5
                break;  // 'return' would work here as well
            } catch (err) {
                console.log('error obteniendo metaData episodio')
            }
            if (metaDataTries == 4) {
                console.log('No pudimos obtener metadata. Saltando este paso')
            }
            metaDataTries++;
        }



        var next = true
        while (next) {
            var click = true
            console.log(titleFormated + '  episodio ' + control)
            const browser = await puppeteer.launch({
                headless: true,
                ignoreHTTPSErrors: true,
                args: [
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-setuid-sandbox',
                    '--no-first-run',
                    '--no-sandbox',
                    '--no-zygote',
                    '--window-size=1280,720',
                ]
            });
            const page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 720 });
            await page.setRequestInterception(true);
            page.on('request', (interceptedRequest) => {
                //'script', 'stylesheet', 'image', 'media', 'font'
                const blockResources = ['stylesheet', 'image', 'media', 'font'];
                if (blockResources.includes(interceptedRequest.resourceType())) {
                    interceptedRequest.abort();
                } else {
                    interceptedRequest.continue();
                }
            });
            await page.setUserAgent(
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
            );

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
                        episode: control
                    })
                }
                console.log('estaba vacio')
                await browser.close();
                next = false
                break
            }
            await page.click('#btn-show-4')
            data = await page.$$eval('iframe', pElements => pElements.map(el => el.getAttribute('src')))
            await browser.close();
            //obtener la miniatura del episodio PENDIENTE

            //obtener title, duration, synopsis
            // let options = {
            //     uri: `https://api.jikan.moe/v4/anime/${anime.mal_id}/episodes/${control}`,
            //     json: true
            // }

            //obtener Metadata del item 
            var title = null
            var synopsis = null
            var duration = null
            for (const episode of metadataAnime) {
                if (episode.mal_id == control) {
                    title = episode.title || null
                    synopsis = episode.synopsis || null
                    duration = episode.duration || null
                }
            }
            if (title == null) {
                //ocurrio un problema de metadata con el episodio
                animeMetadataErrors.push(control)
            }

            // console.log('-------INFO METADATA EPISODIO----------')
            // console.log(title)
            // console.log(synopsis)
            // console.log(duration)
            // while (metaDataTries < 5) {
            //     /*PENDIENTE. 
            //     codigo defectuoso
            //     A veces no carga. Y eso afecta la velocidad
            //     de recoleccion considerablemente
            //     En ocasiones no obtiene el resultado luego de 4 intentos.
            //     Solucion: cargar un a sola vez todos los metadatos de la serie
            //     al inicio del for.
            //     */
            //     console.log(`intento #${metaDataTries}`)
            //     try {
            //         let res = await rp(options)
            //         title = res.data.title
            //         synopsis = res.data.synopsis
            //         duration = res.data.duration
            //         metaDataTries = 5
            //         break;  // 'return' would work here as well
            //     } catch (err) {
            //         console.log('error obteniendo metaData episodio')
            //     }
            //     if (metaDataTries == 4) {
            //         console.log('No pudimos obtener metadata. Saltando este paso')

            //         metaDataError.push({
            //             anime: titleFormated,
            //             episode: control
            //         })
            //     }

            //     metaDataTries++;
            // }

            urls.push({
                url: `https://jkanime.net${data[0]}`,
                title: title,
                synopsis: synopsis,
                duration: duration,
                thumb: ''
            })
            //Actualizar lastUpdate

            successScraps += 1
            lastUpdateDate = Date.now()
            control += 1


        }

        if (urls.length == 0) {
            //Si scalpedEpisodes == 0 y urls.length == 0
            emptyAnimes.push({
                name: titleFormated,
                id: anime.mal_id

            })
        }
        //si tiene animeMetadataErrors, añadirlo a metadataErrors
        if (animeMetadataErrors.length > 0) {
            metaDataErrors.push({
                id: anime.mal_id,
                name: titleFormated,
                episodes: animeMetadataErrors
            })
        }
        console.log(anime.mal_id)
        console.log(isActualSeason)
        //Si la temporada no es la actual, usar fecha que trae el sistema
        if (isActualSeason == 'false') {
            console.log('----------------------------')
            console.log('usando fecha sus: ' + dateNowSus)
            console.log('----------------------------')

            lastUpdateDate = dateNowSus
        }

        if (exists) {
            batch.update(db.collection('animes').doc(anime.mal_id.toString()), {
                score: anime.score || null,
                rank: anime.rank || null,
                episodes: anime.episodes,
                lastUpdate: lastUpdateDate,
                scrapedEpisodes: {
                    sub_esp: urls,
                },
                totalScraped_sub_esp: urls.length
            }, { merge: true })
        } else {
            //Preparar categorias
            // console.log('preparando cats')
            var categories = []
            for (const genre of anime.genres) {
                categories.push(genre.mal_id)
            }
            // console.log(categories)
            batch.set(db.collection('animes').doc(anime.mal_id.toString()), {
                score: anime.score || null,
                rank: anime.rank || null,
                images: anime.images,
                trailer: anime.trailer || null,
                title: anime.title,
                title_japanese: anime.title_japanese || null,
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
                categories: categories,
                explicit_genres: anime.explicit_genres,
                themes: anime.themes,
                demographics: anime.demographics,
                downloaded_episodes: 0,
                lastUpdate: lastUpdateDate,
                scrapedEpisodes: {
                    sub_esp: urls,
                },
                totalScraped_sub_esp: urls.length,
                titleFormated: titleFormated
            })
        }
        // console.log('---------------------------')
        // console.log(anime.mal_id)
        // console.log(urls.length)
        // console.log(anime.episodes)
        // console.log(actualSeason.season)
        // console.log(season)
        // console.log(actualSeason.year)
        // console.log(year)
        // console.log('---------------------------')
        //Si no se ha completado y no es la season actual ES UN LAGGARD
        if ((urls.length < anime.episodes || anime.episodes == null) && (actualSeason.season != season || actualSeason.year != year)) {
            //verificar si no existe en la db 
            var existsLaggard = false
            for (let i = 0; i < laggardAnimes.length; i++) {
                //Si existe, salimons como si nada
                if (laggardAnimes == anime.mal_id) {
                    existsLaggard = true
                    break
                }
            }
            //Si no existe, añadimos a la db, si no ignoramos
            if (!existsLaggard) {
                //añadir solo si esta en airing y scalpEpisodes > 0
                if (anime.airing && urls.length > 0) {
                    console.log('consegui un laggard')
                    console.log('y no estaba en la DB pero si en airing')
                    batch.update(db.collection('statitics').doc('publicConfigs'), {
                        laggardAnimes: admin.firestore.FieldValue.arrayUnion(anime.mal_id.toString())
                    })
                }

            }
        }


        finalizedAnimeCount += 1
        console.log(`${finalizedAnimeCount}/${seasonalAnimes.length} animes completados`)
    };



    //Si no existe la temporada, crearla
    batch.set(db.collection('seasons').doc(year.toString() + '-' + season), {
        lastTryUpdate: Date.now(),
        animeCount: seasonalAnimes.length,
        errors: errors,
        emptyAnimes: emptyAnimes,
        completedAnimes: completedAnimes,
        metaDataErrors: metaDataErrors
    }, { merge: true })
    //PENDIENTE elminar arrays antiguos del log, permitir solamente 20
    var logs = await db.collection('statitics').doc('logs').get()
    var getSetSeasonAnimes = logs.data().getSetSeasonAnimes
    getSetSeasonAnimes.splice(0, getSetSeasonAnimes.length - 19)
    batch.update(db.collection('statitics').doc('logs'), {
        getSetSeasonAnimes: getSetSeasonAnimes
    })
    //Enviar los errores a la DB para revision
    batch.set(db.collection('statitics').doc('logs'), {
        getSetSeasonAnimes: admin.firestore.FieldValue.arrayUnion({
            date: Date.now(),
            errors: errors,
            emptyAnimes: emptyAnimes,
            completedAnimes: completedAnimes,
            fetchedAnimes: seasonalAnimes.length,
            successScraps: successScraps,
            metaDataErrors: metaDataErrors
        })
    }, { merge: true })

    // await promise.all(prepareAnime)
    return await batch.commit()
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

exports.api = functions.runWith({ memory: "1GB", timeoutSeconds: 540 }).https.onRequest(app)

exports.animeCreated = functions.firestore
    .document('animes/{animesID}')
    .onCreate(async (snap, context) => {
        console.log(snap.data().genres)
        //Existe la categoria?

        for (const genre of snap.data().genres) {
            console.log(genre.mal_id)
            //leer la categoria
            var cat = await db.collection('categories').doc(genre.mal_id.toString()).get()
            //si no existe, se crea
            if (!cat.exists) {
                console.log('no existia')
                await db.collection('categories').doc(genre.mal_id.toString()).set({
                    name: genre.name,
                    count: 1
                })
                continue
            }
            //Si existía
            console.log('si existia')

            await db.collection('categories').doc(genre.mal_id.toString()).update({
                count: admin.firestore.FieldValue.increment(1)
            })


        }
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
exports.userCreated = functions.firestore
    .document('usuarios/{usuarioId}')
    .onCreate(async (snap, context) => {
        //crear tambien el userPublic
        db.collection('userPublic').doc(snap.id).set({
            viewedAnimes: [],
            favAnimes: []
        })
    })
//Seasons
exports.seasonCreated = functions.firestore
    .document('seasons/{seasonId}')
    .onCreate(async (snap, context) => {
        //Obtener año y season del id
        var splitted = snap.id.split('-')
        var data = {
            year: parseInt(splitted[0]),
            season: splitted[1]
        }

        var statitics = await db.collection('statitics').doc('publicConfigs').get()
        var array = statitics.data().addedSeasons
        array.unshift(data)
        await db.collection('statitics').doc('publicConfigs').update({
            addedSeasons: array
        })
        return
    })
//CATEGORIES
exports.categoryCreated = functions.firestore
    .document('categories/{categoryId}')
    .onCreate(async (snap, context) => {
        //Guardar en algolia
        const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'prod_categories' : 'test_categories';
        const cat = snap.data();
        cat.objectID = snap.id;
        const index = client.initIndex(ALGOLIA_INDEX_NAME);
        index.saveObject(cat);
        return
    })

exports.categoryUpdated = functions.firestore
    .document('categories/{categoryId}')
    .onUpdate(async (snap, context) => {
        //Guardar en algolia
        const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'prod_categories' : 'test_categories';
        const cat = snap.after.data();
        cat.objectID = snap.after.id;
        const index = client.initIndex(ALGOLIA_INDEX_NAME);
        index.saveObject(cat);
        return
    })
//CRON FUNCTIONS
exports.scheduledFunctionCrontab = functions.pubsub.schedule('0 10,13,15,18 * * *')
    .timeZone('America/Caracas') // Users can choose timezone - default is America/Los_Angeles
    .onRun(async (context) => {
        console.log("---------------------");
        console.log("Ejecutando");
        var options = {
            method: 'POST',
            //https://us-central1-moshianimeapp.cloudfunctions.net/
            //http://localhost:5002/moshianimeapp/us-central1/api/getSetSeasonAnimes
            uri: 'https://us-central1-moshianimeapp.cloudfunctions.net/api/getSetSeasonAnimes',
            body: {
                season: 'winter',
                year: 2023,
                actualSeason: true,
                dateNowSus: null
            },
            json: true // Automatically stringifies the body to JSON
        };
        console.log('haciendo llamada')
        rp(options)

        return null;
    });