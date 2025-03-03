import { Router } from 'express'
import { createRequire } from 'module'
import { getCombinedActivities, getFilteredActivitiesByType, getTotalActivities } from '../services/activitiesService.js'
import { getActivitiesURL, getYearsMapAndTotals } from '../util.js'
import { connect } from '../db/db.js'

const require = createRequire(import.meta.url)

const app = Router()

app.get('/activities', async (req, res) => {
	const connection = await connect()
	const [rows] = await connection.execute('SELECT * FROM runs')

	const yearStart = 2009
	const years = Array.from({ length: new Date().getFullYear() - yearStart + 1 }, (_, i) => yearStart + i)

	const formatNumber = (num, digits) => parseFloat((Math.round(100 * num) / 100).toFixed(digits))
	const initialYearsMap = years.reduce((acc, year) => ({
		...acc,
		[year]: {
			totals: {
				distance: 0,
				activities: 0
			},
			activities: []
		}
	}), {})

	let totalDistance = 0

	const response = rows.reduce((acc, row) => {
		const year = new Date(row.start_date).getFullYear()
		const distance = formatNumber(row.distance, 2)
		totalDistance += formatNumber(distance, 2)
		return {
			...acc,
			[year]: {
				totals: {
					distance: formatNumber(acc[year].totals.distance + distance, 2),
					activities: acc[year].totals.activities + 1
				},
				activities: [...acc[year].activities, {
					...row,
					average_cadence: parseFloat(row.average_cadence),
					average_heartrate: parseFloat(row.average_heartrate),
					average_speed: parseFloat(row.average_speed),
					distance: parseFloat(distance),
					moving_time: parseFloat(row.time),
					suffer_score: parseFloat(row.suffer_score)
				}]
			}
		}
	}, initialYearsMap)

	response.totals = {
		distance: formatNumber(totalDistance, 2),
		activities: rows.length
	}

	await connection.end()

	res.send(response)
})

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