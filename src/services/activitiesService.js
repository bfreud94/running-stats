import fetch from 'node-fetch'
import { getActivitiesURL, getAthleteInfoURL, getAthleteStatsURL, getYearsMap, meterToMile } from '../util.js'

export const getTotalActivities = async () => {
    const activities = await getAllActivities()
    return activities
        .map(({ count }) => count)
        .reduce((total, curr) => total += curr )
}

export const getAllActivities = async () => {
    const { id } = await (await fetch(getAthleteInfoURL())).json()
    const { all_ride_totals, all_run_totals, all_swim_totals } = await (await fetch(getAthleteStatsURL(id))).json()
    const all_activities = [all_ride_totals, all_run_totals, all_swim_totals]
    return all_activities
}

export const getCombinedActivities = async (totalActivities, url) => {
    let page = 1
    let promises = []
    
    while ((page - 1) * 100 <= totalActivities) {
        const promise = fetch(url)
        promises.push(promise)
        url = getActivitiesURL(++page)
    }

    let results = await Promise.all(promises)
    results = await Promise.all(results.map(r => r.json()))
    
    return results
}

export const getFilteredActivitiesByType = (activities, type) => {
    let totalDistance = 0
    const yearsMap = getYearsMap()
    const filteredAndSortedRuns = activities
        .flat()
        .map((activity) => ({
            ...activity,
            distance: meterToMile(activity.distance)
        }))
        .filter((activity) => {
            const year = activity.start_date.substring(0, 4)
            if (activity.type === type) {
                yearsMap[year].activities.push(activity)
                yearsMap[year].totals.activities++
                yearsMap[year].totals.distance += activity.distance
                totalDistance += activity.distance
            }
            return activity.type === type
        })
    Object.keys(yearsMap).forEach(year => {
        yearsMap[year].totals.distance = Math.round(100 * yearsMap[year].totals.distance) / 100
    })
    return {
        filteredAndSortedRuns,
        totalDistance,
        yearsMap
    }
}