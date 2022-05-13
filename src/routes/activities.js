import { Router } from 'express'
import fetch from 'node-fetch'
import {
    getActivitiesURL,
    getAthleteInfoURL,
    getAthleteStatsURL,
    getYearsMap,
} from '../util.js'

import { createRequire } from 'module'

import { access_token } from '../index.js'

const require = createRequire(import.meta.url)

const app = Router()

app.get('/totalActivites', async (req, res) => {
    let promises = []

    if (process.env.USE_STUB) {
        const stubbedData = require('../stubs/data.json')
        res.send(stubbedData)
        return
    }

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
        /*
        .map(({
            distance,
            start_date
        }) => ({
            distance: meterToMile(distance),
            start_date
        }))
        */
        .sort((a, b) => a.distance < b.distance ? 1 : -1)
    res.send({
        total: results.length,
        runs: results
    })
})

app.get('/yearlyData', async (req, res) => {
    let promises = []

    if (process.env.USE_STUB) {
        const stubbedData = require('../stubs/data.json')
        const yearsMap = getYearsMap()
        stubbedData.runs.forEach(run => {
            const year = run.start_date.substring(0, 4)
            yearsMap[year].runs.push(run)
            yearsMap[year].totals.activities++
            yearsMap[year].totals.distance += parseFloat(run.distance.toFixed(2))
        })
        res.send(yearsMap)
        return
    }
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
        /*
        .map(({
            distance,
            start_date
        }) => ({
            distance: meterToMile(distance),
            start_date
        }))
        */
        .sort((a, b) => a.distance < b.distance ? 1 : -1)
    res.send({
        total: results.length,
        runs: results
    })
})

export default app