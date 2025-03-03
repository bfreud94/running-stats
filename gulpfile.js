import gulp from 'gulp'
import 'dotenv/config'

import { connect, disconnect } from './src/db/db.js'
import { INSERT_QUERY, SELECT_QUERY, UPDATE_QUERY } from './src/gulp/queries.js'
import { WRITE_NEW_ACTIVITIES_SEARCH_STRING } from './src/gulp/constants.js'

import { getActivitiesToAdd, getActivitiesToReplace, getResponseActivities } from './src/gulp/api.js'
import { getUpdateSearchString, writeNewActivitiesToSqlTemplate, writeUpdateActivitiesToSqlTemplate } from './src/gulp/writeToSqlTemplate.js'
import { createActivityDto, getActivityDtoValues } from './src/gulp/dto.js'

gulp.task('dbLoad', async (done) => {
	
	console.log('Loading database...')

	// create logic to also load ride data

	let connection

	try {
		connection = await connect()
		const [rows] = await connection.execute(SELECT_QUERY)

		const responseActivities = await getResponseActivities(process.env.ACCESS_TOKEN)
		const activitesToAdd = getActivitiesToAdd(responseActivities, rows)
		const activitiesToReplace = getActivitiesToReplace(responseActivities, rows)

		activitiesToReplace.forEach(async activity => {
			const values = [
				activity.name,
				activity.id
			]

			const oldActivityName = rows.find(row => row.id == activity.id).name
			const searchString = getUpdateSearchString(activity, oldActivityName, rows)
			writeUpdateActivitiesToSqlTemplate(activity, searchString, oldActivityName)
			
			console.log(`Updating activity with id: ${activity.id} on ${activity.start_date}`)
			await connection.execute(UPDATE_QUERY, values)
		})

		activitesToAdd.forEach(async (activity, activityIndex) => {
			const activityDbto = createActivityDto(activity)
			const values = getActivityDtoValues(activityDbto)
			
			console.log(`Adding activity with id: ${activityDbto.id} on ${activityDbto.start_date}`)
			await connection.execute(INSERT_QUERY, values)

			writeNewActivitiesToSqlTemplate(activityDbto, activityIndex, activitesToAdd, WRITE_NEW_ACTIVITIES_SEARCH_STRING)
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