import { metersToMile } from './util.js'

export const activityDtoToSqlStatement = (activityDto, isFirstElement, isLastElement) =>
	`${isFirstElement ? '),' : ''}(${activityDto.average_cadence},${activityDto.average_heartrate},${activityDto.average_speed},` +
	`${metersToMile(activityDto.distance)},${activityDto.id},'${activityDto.name}','${activityDto.start_date}',` +
	`${activityDto.suffer_score},${activityDto.time})${isLastElement ? '' : ','}`

export const createActivityDto = (activity) => ({
	average_cadence: activity.average_cadence || 0,
	average_heartrate: activity.average_heartrate || 0,
	average_speed: activity.average_speed,
	distance: metersToMile(activity.distance),
	id: activity.id,
	name: activity.name,
	start_date: formatActivityDtoDate(activity.start_date_local),
	suffer_score: activity.suffer_score || 0,
	time: activity.moving_time
})

export const formatActivityDtoDate = (date) => new Date(date).toISOString().slice(0, 19).replace('T', ' ')

export const getActivityDtoValues = (activityDbto) => [
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