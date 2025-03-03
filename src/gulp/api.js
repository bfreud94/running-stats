export const getActivitiesToAdd = (responseActivities, rows) => responseActivities
	.reverse()
	.filter(activity => activity.type === 'Run')
	.filter(activity => !rows.some(row => row.id == activity.id))

export const getActivitiesToReplace = (responseActivities, rows) => responseActivities
	.reverse()
	.filter(activity => activity.type === 'Run')
	.filter(activity => rows.some(row => row.id == activity.id && row.name !== activity.name))

export const getResponseActivities = async (access_token) => {
	const url = `https://www.strava.com/api/v3/athlete/activities?access_token=${access_token}&per_page=50&page=1`
	const response = await fetch(url)
	const responseActivities = await response.json()
	return responseActivities
}