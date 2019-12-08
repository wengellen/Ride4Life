// const DriverProfile = require('../driver.model')

import {Trip} from '../Trip.model'
import {Rider} from '../../rider/rider.model'
import {Driver} from '../../driver/driver.model'

describe('Rider model', () => {
	let rider
	let driver
	
	beforeAll(async() => {
		driver = await Driver.create({
			firstName: 'Tilly',
			lastName: 'Mills',
			phone: '123456',
			email: 'tg@gmail.com',
			username:'12345',
			password:'0000',
			city:'city'
		})
		rider = await Rider.create({
			firstName: 'Tilly',
			lastName: 'Mills',
			phone: '123456',
			email: 'tg@gmail.com',
			username:'34567',
			password:'0000',
		})
	});
	test('rider must be required', async () => {
		expect.assertions(1)
		
		const driver = await Driver.create({
			firstName: 'Tilly',
			lastName: 'Mills',
			phone: '123456',
			email: 'tg@gmail.com',
			username:'12345',
			password:'0000',
			city:'city'
		})
		const rider = await Rider.create({
				firstName: 'Tilly',
				lastName: 'Mills',
				phone: '123456',
				email: 'tg@gmail.com',
				username:'34567',
				password:'0000',
		})
		try {
			await Trip.create({
				location:'12345',
				startLocation:'12345',
				endLocation: 'sasha@gmail.com',
				startLocationAddress:'12345',
				endLocationAddress: 'sasha@gmail.com',
				// rider:rider.id,
				driver:driver.id,
				review:'1234',
				tripRating:5,
				tripFare:40,
				quote:30,
				baseFare:10,
				distance:10,
				duration:10
			})
		} catch (e) {
			expect(e).toBeTruthy()
		}
	})
	test('status should default to offline', async () => {
		const trip1 = await Trip.create({
			location:'12345',
			startLocation:'12345',
			endLocation: 'sasha@gmail.com',
			startLocationAddress:'12345',
			endLocationAddress: 'sasha@gmail.com',
			rider:rider.id,
			driver:driver.id,
			review:'1234',
			tripRating:5,
			tripFare:40,
			quote:30,
			baseFare:10,
			distance:10,
			duration:10
		})
		
		expect(trip1.status).toBe('requesting')
	})
})
