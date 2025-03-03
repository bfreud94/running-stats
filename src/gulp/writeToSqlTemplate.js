import { readFileSync, writeFileSync } from 'fs'
import { activityDtoToSqlStatement } from './dto.js'
import { replaceAt } from './util.js'
import { SQL_FILE_LOCATION } from './constants.js'

export const getUpdateSearchString = (activity, oldActivityName, rows) => {
	const activityDateString = activity.start_date.toString()
	const dateEndIndex = activityDateString.indexOf('T')
	const searchString = `'${oldActivityName}','${activityDateString.substring(0, dateEndIndex)}`
	return searchString
}

export const writeNewActivitiesToSqlTemplate = (activityDbto, activityIndex, activitesToAdd, searchString) => {
	const isLastElement = activityIndex === activitesToAdd.length - 1
	const additionalData = activityDtoToSqlStatement(activityDbto, activityIndex === 0, isLastElement)

	const fileContent = readFileSync(SQL_FILE_LOCATION, 'utf8')
	const index = fileContent.indexOf(searchString) - 3
	if (index > 0) {
		const newFileContent = replaceAt(index, fileContent, additionalData, isLastElement ? 1 : 0)
		writeFileSync(SQL_FILE_LOCATION, newFileContent)
	}
}

export const writeUpdateActivitiesToSqlTemplate = (activityDbto, searchString, oldActivityName) => {
	const fileContent = readFileSync(SQL_FILE_LOCATION, 'utf8')
	const index = fileContent.indexOf(searchString)
	if (index > 0) {
		const newFileContent = replaceAt(index, fileContent, `'${activityDbto.name}`, oldActivityName.length + 1)
		writeFileSync(SQL_FILE_LOCATION, newFileContent)
	}
}