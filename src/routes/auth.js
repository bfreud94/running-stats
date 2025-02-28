import { Router } from 'express'
import fetch from 'node-fetch'
import { getAuthorizedURL } from '../util.js'

import 'dotenv/config'

const app = Router()

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const auth_grant_type = process.env.AUTH_GRANT_TYPE_AUTH_CODE

app.get('/authorized', async (req, res) => {
    const url = getAuthorizedURL(client_id, client_secret, req.query.code, auth_grant_type)
    const data = await (await fetch(url, { method: 'POST' })).json()
    req.app.set('access_token', data.access_token)
    res.redirect('/')
})

app.get('/access-token', async (req, res) => {
	res.send({ access_token: req.app.get('access_token') })
})

export default app