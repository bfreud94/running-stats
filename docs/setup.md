# Update data
1. npm run db:load

## npm run db:load
- Gets data from strava
- Gets new/different data
	- Adds new data to sql insert statement defined in strava.sql
	- Updates changes in existing data
	   - Finds where the old run exists within the insert statement defined in strava.sql
	   - Replaces old datapoints with new ones