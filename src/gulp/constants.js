import path from 'path'

export const SQL_FILE_LOCATION =  path.resolve('./src/db/scripts/strava.sql')

export const WRITE_NEW_ACTIVITIES_SEARCH_STRING = '/*!40000 ALTER TABLE `runs` ENABLE KEYS */;'