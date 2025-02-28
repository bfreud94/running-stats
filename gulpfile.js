import gulp from 'gulp'
import { connect, disconnect } from './src/db.js'

import 'dotenv/config'

gulp.task('dbLoad', async (done) => {
	console.log('Loading database...')

	// create logic to also load ride data

	let connection

	try {
		connection = await connect()
		const [rows] = await connection.execute('SELECT * FROM runs')
		const access_token = process.env.ACCESS_TOKEN
		const url = `https://www.strava.com/api/v3/athlete/activities?access_token=${access_token}&per_page=50&page=1`
		const response = await fetch(url)
		const responseActivities = await response.json()

		const activitesToAdd = responseActivities
			.filter(activity => activity.type === 'Run')
			.filter(activity => !rows.some(row => row.id == activity.id))
		
		const activitiesToReplace = responseActivities
			.filter(activity => activity.type === 'Run')
			.filter(activity => rows.some(row => row.id == activity.id && row.name !== activity.name))
		
		const updateQuery = `
			UPDATE runs
			SET name = ?
			WHERE id = ?
		`

		activitiesToReplace.forEach(async activity => {
			const values = [
				activity.name,
				activity.id
			]
			
			await connection.execute(updateQuery, values)
		})

		activitesToAdd.forEach(async activity => {
			const activityDbto = {
				average_cadence: activity.average_cadence || 0,
				average_heartrate: activity.average_heartrate || 0,
				average_speed: activity.average_speed,
				distance: Math.round(100 * (activity.distance / 1609.34)) / 100,
				id: activity.id,
				name: activity.name,
				start_date: new Date(activity.start_date_local).toISOString().slice(0, 19).replace('T', ' '),
				suffer_score: activity.suffer_score || 0,
				time: activity.moving_time
			}
			
			const insertQuery = `
				INSERT INTO runs (average_cadence, average_heartrate, average_speed, distance, id, name, start_date, suffer_score, time)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			`
			
			const values = [
				activityDbto.average_cadence,
				activityDbto.average_heartrate,
				activityDbto.average_speed,
				activityDbto.distance,
				activityDbto.id,
				activityDbto.name,
				activityDbto.start_date,
				activityDbto.suffer_score,
				activityDbto.time
			]
			
			await connection.execute(insertQuery, values)
		})

		await disconnect(connection)
	} catch (err) {
		if (connection) {
			await disconnect(connection)
		}
		console.error('Error loading database:', err)
	}
	done()
})

gulp.task('default', gulp.series('dbLoad'))