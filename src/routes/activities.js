import { Router } from 'express'
import { createRequire } from 'module'
import { getCombinedActivities, getFilteredActivitiesByType, getTotalActivities } from '../services/activitiesService.js'
import { getActivitiesURL, getYearsMapAndTotals } from '../util.js'

const require = createRequire(import.meta.url)

const app = Router()

app.get('/yearlyActivities', async (req, res) => {
	const sport = req.query['sport'] || 'Run'

    if (process.env.USE_STUB === 'true') {
        const stubbedData = require(sport === 'Run' ? '../stubs/runData.json' : '../stubs/rideData.json')
        res.send(stubbedData)
        return
    }

    const url = getActivitiesURL(1)
    const totalActivities = await getTotalActivities()

    const runs = await getCombinedActivities(totalActivities, url)
    const { filteredAndSortedActivities, totalDistance, yearsMap } = getFilteredActivitiesByType(runs, sport)

	const response = getYearsMapAndTotals(filteredAndSortedActivities, totalDistance, yearsMap)
	
    res.send(response)
})

export default app