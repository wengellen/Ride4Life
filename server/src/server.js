import express from 'express'
require('dotenv').config()
import * as logger  from './logger'
import http from "http"
import {io, initialize} from "./io";
import { json, urlencoded } from 'body-parser'
import formData from 'express-form-data'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import { connect } from './utils/db'
import { signup, signin, protect } from './utils/auth'
import driverRouter from './resources/driver/driver.router'
import riderRouter from './resources/rider/rider.router'
import tripRouter from './resources/trip/trip.router'
import userRouter from './resources/user/user.router'

export const app = express()
const httpServer = http.Server(app);
const globalSocket = initialize(httpServer)
let corsOptions = {}

console.log('process.env.NODE_ENV',process.env.NODE_ENV)

if (process.env.NODE_ENV ==='PRODUCTION') {
	corsOptions = {
		origin: 'https://reverent-wozniak-c1db03.netlify.com/'
	}
	
}else{
	corsOptions = {
		origin: 'http://localhost:3000'
	}
}

app.disable('x-powered-by')
app.use(cors(corsOptions))
app.use(json())

app.use(formData.parse())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/signup', signup)
app.post('/signin', signin)

app.use('/api', protect)
app.use('/api/rider', riderRouter)
app.use('/api/driver', driverRouter)
app.use('/api/trip', tripRouter)

app.use('/api/user', userRouter)


export const start = async () => {
	try {
		await connect()
		httpServer.listen(config.port, () => {
			console.log(`REST API on http://localhost:${config.port}`)
		})
	} catch (e) {
		console.error(e)
	}
}
