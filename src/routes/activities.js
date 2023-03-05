import { Router } from 'express'
import { getActivitiesURL } from '../util.js'
import { createRequire } from 'module'
import { getCombinedActivities, getFilteredActivitiesByType, getTotalActivities } from '../services/activitiesService.js'

const require = createRequire(import.meta.url)

const meterToMile = (meter) => (meter / 1609.34)

const app = Router()

app.get('/yearlyRuns', async (req, res) => {
    if (process.env.USE_STUB === 'true') {
        const stubbedData = require('../stubs/newData.json')
        res.send(stubbedData)
        return
    }

    const url = getActivitiesURL(1)
    const totalActivities = await getTotalActivities()

    const runs = await getCombinedActivities(totalActivities, url)
    const { filteredAndSortedRuns, totalDistance, yearsMap } = getFilteredActivitiesByType(runs, 'Run')

    res.send({
        ...yearsMap,
        totals: {
            activities: filteredAndSortedRuns.length,
            distance: parseFloat(meterToMile(totalDistance).toFixed(2))
        }
    })
})

export default app