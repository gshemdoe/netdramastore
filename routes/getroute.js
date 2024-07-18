const express = require('express')
const mongoose = require('mongoose')
const botUsersModel = require('../models/botusers')
const newDramaModel = require('../models/vue-new-drama')
const homeModel = require('../models/vue-home-db')
const blogModel = require('../models/postmodel')
const ohmyBotUsersModel = require('../models/ohmyusers')
const ohmyfilesModel = require('../models/ohmyfiles')
const ohmyOffersModel = require('../models/ohmyOffers')
const episodeModel = require('../models/dramastore-episode')

//Times
const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const axios = require('axios').default

// TELEGRAM
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const boosterBot = new Telegraf(process.env.OH_BOT2)

// TELEGRAPH
const telegraph = require('telegraph-node')
const ph = new telegraph()

const router = express.Router()

//send success (no content) response to browser
router.get('/favicon.ico', (req, res) => res.status(204).end());

router.get('/', async (req, res) => {
    try {
        const latest = await homeModel.find().sort('-year').sort('-createdAt').limit(16)
        const popular = await newDramaModel.find().sort('-thisMonth').limit(25)


        res.render('home/home', { latest, popular })
    } catch (err) {
        console.log(err)
        res.send('Internal Error, try again later')
        bot.telegram.sendMessage(process.env.TG_SHEMDOE, err.message)
    }
})

//only for telegram
function errorDisplay(error, userId, multiBot) {
    if (error.message) {
        console.log(error.message)
        multiBot.telegram.sendMessage(process.env.TG_SHEMDOE, `${error.message} for user with ${userId}`)
    }
    if (error.description) {
        console.log(error.description)
        multiBot.telegram.sendMessage(process.env.TG_SHEMDOE, `${error.description} for user with ${userId}`)
    } else {
        multiBot.telegram.sendMessage(process.env.TG_SHEMDOE, `Error in adding points for ${userId}, critical check logs`)
    }
}

router.get(['/user/:id/boost', '/user/:id/boost/:ignore'], async (req, res) => {
    try {
        const userId = req.params.id

        let user = await botUsersModel.findOne({ userId })
        let temp = await botUsersModel.find().limit(100).sort('-downloaded').select('fname points downloaded updatedAt userId')
        let ranks = []

        for (let u of temp) {
            if (u.fname == '@shemdoe') {
                ranks.push({
                    fname: u.fname, points: u.points, downloaded: u.downloaded, updatedAt: "a moment ago"
                })
            } else {
                ranks.push({
                    fname: u.fname, points: u.points, downloaded: u.downloaded, updatedAt: timeAgo.format(new Date(u.updatedAt))
                })
            }
        }

        res.render('userstatus/userstatus', { user, ranks })
    } catch (err) {
        console.log(err)
        res.send(`<h2>Error:</h2> ${err.message}`)
        bot.telegram.sendMessage(process.env.TG_SHEMDOE, err.message)
    }
})

router.get('/dramastore-add-points/user/:id', async (req, res) => {
    const userId = req.params.id
    try {
        let botuser = await botUsersModel.findOneAndUpdate({ userId }, { $inc: { points: 1 } }, { new: true })
        res.send(botuser)
        bot.telegram.sendMessage(userId, `+1 more point added... you've <b>${botuser.points} points</b>`, { parse_mode: 'HTML' })
            .catch((err) => {
                errorDisplay(err, userId, bot)
            })
    } catch (err) {
        console.log(err)
        res.status(400).send(`<h2>Error: Couldn't add point, try again later</h2>`)
        bot.telegram.sendMessage(process.env.TG_SHEMDOE, `Error in adding points for ${userId}`)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        res.render('maintenance')
    } catch (err) {
        console.log(err)
        res.status(400).send(`${err.message}\n`)
    }

})

//new episode req by paths
router.get('/download/episode/:_id/:userid', async (req, res) => {
    try {
        const ep_id = req.params._id
        const userId = req.params.userid
        //const myip = req.ip

        let episode = await episodeModel.findById(ep_id)
        let the_user = await botUsersModel.findOne({ userId })

        let user = {
            fname: the_user.fname,
            userId,
            points: the_user.points,
            downloaded: the_user.downloaded,
            last: timeAgo.format(new Date(the_user.updatedAt))
        }

        res.render('episode-view/episode', { episode, user })
    } catch (err) {
        console.log(err.message)
    }
})

//new episode req by query params
router.get('/download/episode', async (req, res) => {
    try {
        let { ep_id, userid } = req.query

        //check if there is no ep_id and userid queries
        if (!ep_id && !userid) {
            ep_id = '643d1da000e9b3ff97e5e269'
            userid = 741815228
        }

        let episode = await episodeModel.findById(ep_id)
        let the_user = await botUsersModel.findOne({ userId: Number(userid) })

        let user = {
            fname: the_user.fname,
            userId: the_user.userId,
            points: the_user.points,
            downloaded: the_user.downloaded,
            last: timeAgo.format(new Date(the_user.updatedAt))
        }

        res.render('episode-view/episode', { episode, user })
    } catch (err) {
        console.log(err.message)
        res.status(404).send(`You followed an incorrect url. Please ensure you clicked a button sent to you by dramastore bot<br></br>If this error persist contact dramastore admin @shemdoe`)
    }
})

router.get('/success/send/:_id/:userid', async (req, res) => {
    let _id = req.params._id
    let userId = req.params.userid
    let dbChannel = -1001239425048
    let shemdoe = 741815228
    let props = [
        `https://gronsoakoube.net/4/7646739`,
        `https://ptaixout.net/4/7748642`,
        `https://whulsaux.com/4/7514550`,
        `https://gleemahortus.com/4/7736114`,
        `https://mauhouphoa.com/4/4184987`,
        `https://laicoomaumoo.net/4/6141068`,
        `https://saicewheefe.net/4/5344594`,
        `https://psauwaun.com/4/7748641`,
        `https://ptugnins.net/4/3311028`,
        `https://noakiglo.com/4/3311014`,
        `https://zaipegrob.net/4/7749674`,
        `https://juzaugleed.com/4/7749675`,
        `https://soglaitsy.com/4/7749676`,
        `https://gouthishoust.net/4/7749677`,
        `https://stighoazon.com/4/7749678`,
        `https://ithougroa.net/4/7749679`,
        `https://ouphaips.net/4/7749680`,
        `https://ptaiptistie.com/4/7749682`,
        `https://whoursie.com/4/7749683`,
        `https://eekseecm.net/4/7749685`,
    ]

    try {
        await botUsersModel.findOneAndUpdate({ userId }, { $inc: { downloaded: 1 } })
        let randomIndex = Math.floor(Math.random() * props.length);
        res.redirect(props[randomIndex])
        let epinfo = await episodeModel.findById(_id)
        setTimeout(() => {
            bot.telegram.copyMessage(userId, dbChannel, epinfo.epid)
                .catch(e => console.log(e.message))
        }, 10000)
    } catch (err) {
        console.log(err.message, err)
    }
})

router.get('/download/episode/option2/:ep_id/shemdoe', async (req, res) => {
    try {
        let ep_id = req.params.ep_id
        res.redirect(`http://telegram.me/dramastorebot?start=marikiID-${ep_id}`)
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/shemdoe/req/top-100', async (req, res) => {
    try {
        // Fetch data from MongoDB using Mongoose
        const temp = await botUsersModel.find()
            .limit(100).sort('-downloaded')
            .select('fname points downloaded updatedAt userId');

        // Transform the data into the desired format
        const ranks = temp.map(u => ({
            fname: u.fname,
            points: u.points,
            downloaded: u.downloaded,
            updatedAt: timeAgo.format(new Date(u.updatedAt), 'twitter-minute')
        }));

        // Send the transformed data in the response
        res.status(200).json(ranks);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/ebook/free/download/:book', async (req, res) => {
    try {
        const book = req.params.book
        switch (book) {
            case 'atomic':
                let info = {
                    title: 'Atomic Habits',
                    dd: `https://mega.nz/file/jxwnjKbZ#Ba5fFrfgDEYwfpVqmSsAHWOYejUpMPaYA0s5w_lDbW4`,
                    cover: '/images/atomic.webp',
                    sub: `The most fundamental information about habit formation, so you can accomplish more by focusing on less.`
                }
                res.render('zlanding/landing', { info })
                break;

            default:
                res.status(404).send('Book not found')
        }

    } catch (err) {
        console.log(err.message, err)
    }
})

router.all('*', (req, res) => {
    res.sendStatus(404)
})

module.exports = router