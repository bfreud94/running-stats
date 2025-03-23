# API Process

There are two available network requests avialable for use

## activities
- Gets data from local database
	- Database can run locally
	- Or as part of a docker compose
		
## yearlyActivities
- Checks if environment variable `USE_STUB` is `true`
- If it is, return data in the json file
    - This mock is data from a recent requests
	    - runData.json and rideData.json return ALL of the strava data because it takes everything from strava and returns it
		newData.json returns data that was stored in the database
			- more critical (used) values
	- If it's not, get data from strava
		- Strava returns 100 runs maximum
		- Need to keep making requests until all runs are returned
	- During development, it's best to use the stub because of rate limiting
		- Maximum 1000 requests daily
		- Each API request from the FE client makes 16 requests to strava because that's how many pages of data there are
			- Calculated by total activities / 100