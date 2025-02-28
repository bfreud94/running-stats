import express from 'express'
import cors from 'cors'
import { getAuthMarkup, getAuthorizingURL, getStyles } from './util.js'
import authRoutes from './routes/auth.js'
import dataRoutes from './routes/data.js'
import activitiesRoutes from './routes/activities.js'

import 'dotenv/config'

const port = process.env.PORT
const app = express()

const client_id = process.env.CLIENT_ID

export let access_token = process.env.ACCESS_TOKEN

app.use(cors({
    origin: '*'
}))

app.get('/', (req, res) => {
    const url = getAuthorizingURL(
        process.env.AUTH_API_SCOPE,
        process.env.NODE_ENV === 'development' ? process.env.LOCAL_DOMAIN : process.env.DOMAIN,
        client_id
    )
    
    access_token = access_token || req.app.get('access_token')

    res.setHeader('Content-type','text/html')

    const styles = getStyles()

    res.send(Buffer.from(getAuthMarkup(styles, url)))
})

app.use('/api/', authRoutes)

app.use((req, res, next) => {
	const isV2 = req.path.includes('activities')
    if (!access_token && !isV2) {
        res.redirect('/')
        return
    }
    next()
})

app.use('/api/', activitiesRoutes)
app.use('/api/', dataRoutes)

app.listen(port, () => {
    console.log(`Server started port on ${port}`)
});