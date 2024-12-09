import { Router } from 'express'
import { writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getCombinedActivities, getFilteredActivitiesByType, getTotalActivities } from '../services/activitiesService.js'
import { getActivitiesURL, getYearsMapAndTotals } from '../util.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = Router()

app.get('/updateMockData', async (req, res) => {
	const sport = req.query['sport'] || 'Run'

    const url = getActivitiesURL(1)
    const totalActivities = await getTotalActivities()

    const runs = await getCombinedActivities(totalActivities, url)
    const { filteredAndSortedActivities, totalDistance, yearsMap } = getFilteredActivitiesByType(runs, sport)

	const data = getYearsMapAndTotals(filteredAndSortedActivities, totalDistance, yearsMap)

	let response = 'Success! Overrode mock data.'

	try {
		const filePath = path.resolve(__dirname, sport === 'Run' ? '../stubs/runData.json' : '../stubs/rideData.json')
		writeFileSync(filePath, JSON.stringify(data, null, '\t'))
	} catch (err) {
		console.log(err)
		response = 'Error overriding mock data.'
	}
	
    res.send(response)
})

export default app