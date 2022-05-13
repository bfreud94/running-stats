import express from 'express'
import cors from 'cors'
import { getAuthMarkup, getAuthorizingURL, getStyles } from './util.js'

import authRoutes from './routes/auth.js'
import activitiesRoutes from './routes/activities.js'

import 'dotenv/config'

const port = process.env.PORT
const app = express()

const client_id = process.env.CLIENT_ID

export let access_token

app.use(cors({
    origin: '*'
}))

app.get('/', (req, res) => {
    const url = getAuthorizingURL(
        process.env.AUTH_API_SCOPE,
        process.env.NODE_ENV === 'development' ? process.env.LOCAL_DOMAIN : process.env.DOMAIN,
        client_id
    )

    access_token = req.app.get('access_token')

    res.setHeader('Content-type','text/html')

    const styles = getStyles(!!access_token)

    res.send(Buffer.from(getAuthMarkup(access_token, styles, url)))
})

app.use('/api/', authRoutes)

app.use((req, res, next) => {
    if (!access_token) {
        res.redirect('/')
        return
    }
    next()
})

app.use('/api/', activitiesRoutes)

app.listen(port, () => {
    console.log(`Server started port on ${port}`)
});