import express from 'express'
import * as logger  from './logger'
import http from "http"
import {io, initialize} from "./io";
import { json, urlencoded } from 'body-parser'
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

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/signup', signup)
app.post('/signin', signin)

app.use('/api', protect)
app.use('/api/rider', riderRouter)
app.use('/api/driver', driverRouter)
app.use('/api/trip', tripRouter)

app.use('/api/user', userRouter)

//
// setInterval(function () {
// 	globalSocket.emit('PULSE', heartbeat())
// }, 1000);
//
// function heartbeat() {
// 	// Retun a random number between 60 (inc) and max (exc)
// 	const pulse = Math.ceil(Math.random() * (160 - 60) + 60);
// 	console.log(`Heartbeat ${pulse}`);
// 	return pulse;
// }


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
