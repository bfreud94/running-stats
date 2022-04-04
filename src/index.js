import express from 'express'
import fetch from 'node-fetch'
import {
    getActivitiesURL,
    getAthleteInfoURL,
    getAthleteStatsURL,
    getAuthMarkup,
    getAuthorizedURL,
    getAuthorizingURL,
    getStyles,
    meterToMile
} from './util.js'

import 'dotenv/config'

const port = process.env.PORT
const app = express()

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET

// Docs
let access_token = ''

app.get('/', (req, res) => {
    const url = getAuthorizingURL(
        process.env.AUTH_API_SCOPE,
        process.env.NODE_ENV === 'development' ? process.env.LOCAL_DOMAIN : process.env.DOMAIN,
        client_id
    )

    res.setHeader('Content-type','text/html')

    const styles = getStyles(access_token)

    res.send(Buffer.from(getAuthMarkup(access_token, styles, url)))
})

app.get('/authorized', async (req, res) => {
    const url = getAuthorizedURL(client_id, client_secret, req.query.code, process.env.AUTH_GRANT_TYPE)
    const data = await (await fetch(url, { method: 'POST' })).json()
    access_token = data.access_token
    res.redirect('/')
})

app.get('/totalActivites', async (req, res) => {
    let promises = []
    
    const { id } = await (await fetch(getAthleteInfoURL(access_token))).json()
    const { all_ride_totals, all_run_totals, all_swim_totals } = await (await fetch(getAthleteStatsURL(access_token, id))).json()
    const totalAllActivities = [all_ride_totals, all_run_totals, all_swim_totals]
        .map(({ count }) => count)
        .reduce((total, curr) => total += curr )
    
    let page = 1
    let url = getActivitiesURL(access_token, page)
    
    while ((page - 1) * 100 <= totalAllActivities) {
        const promise = fetch(url)
        promises.push(promise)
        url = getActivitiesURL(access_token, ++page)
    }
    
    let results = await Promise.all(promises)
    results = await Promise.all(results.map(r => r.json()))
    results = results
        .flat()
        .filter(activity => activity.type === 'Run')
        .sort((a, b) => a.distance < b.distance ? 1 : -1)
    res.send({
        total: results.length,
        tenLongestRuns: results.slice(0, 10).map(run => ({
            distance: meterToMile(run.distance),
            start_date: run.start_date
        }))
    })
})

// Starting server
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started port on ${port}`)
});