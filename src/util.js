import 'dotenv/config'

export const getActivitiesURL = (access_token, page) => `https://www.strava.com/api/v3/athlete/activities?access_token=${access_token}&per_page=100&page=${page}`

export const getAuthorizingURL = (scope, domain, client_id) => `https://www.strava.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${domain}/authorized&approval_prompt=force&scope=${scope}`

export const getAuthorizedURL = (client_id, client_secret, code, grant_type) =>
    `https://www.strava.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=${grant_type}`

export const getAthleteInfoURL = (access_token) => `https://www.strava.com/api/v3/athlete?access_token=${access_token}`

export const getAthleteStatsURL = (access_token, id) => `https://www.strava.com/api/v3/athletes/${id}/stats?access_token=${access_token}`

export const getStyles = (access_token) => ({
    button_style: 'margin-left:20px',
    div_style: 'display:flex;align-items:center',
    header_style: `color:${access_token ? 'green' : 'red'}`
})

export const meterToMile = (meters) => meters / 1609.34

export const getAuthMarkup = (access_token, { button_style, div_style, header_style }, url) => (
    `
        <div style=${div_style}>
            <h3 style=${header_style}>${access_token ? 'Authorized' : 'Unauthorized'}</h3>
            <a href="${url}"><button style=${button_style}>Sign in</button></a>
        </div>
    `
)