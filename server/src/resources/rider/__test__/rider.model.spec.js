// const DriverProfile = require('../driver.model')

import {Rider} from '../rider.model'


describe('Rider model', () => {
	test('username must be required', async () => {
		expect.assertions(1)
		
		try {
			await Rider.create({
				phone:'12345',
				password:'12345',
				email: 'sasha@gmail.com'
			})
		} catch (e) {
			expect(e).toBeTruthy()
		}
	})
	test('Email must be required', async () => {
		expect.assertions(1)
		
		try {
			await Rider.create({
				username: 'Williams',
				phone:'12345',
				password:'12345',
			})
		} catch (e) {
			expect(e).toBeTruthy()
		}
	})
	test('Password must be required', async () => {
		expect.assertions(1)
		
		try {
			await Rider.create({
				username: 'Williams',
				phone:'12345',
				email:'12345@gmail.com'
			})
		} catch (e) {
			expect(e).toBeTruthy()
		}
	})
	test('email must be unique', async () => {
		expect.assertions(1)
		
		try {
			await Rider.init() // wait for index to build
			await Rider.create([
				{
					username: 'Williams',
					phone:'12345',
					email:'12345@gmail.com',
					password:'1234'
				},
				{
					username: 'Williams',
					phone:'12345',
					email:'12345@gmail.com',
					password:'1234'
				}
			])
		} catch (e) {
			expect(e).toBeTruthy()
		}
	})
	test('status should default to offline', async () => {
		const rider1 = await Rider.create({
			firstName: 'Tilly',
			lastName: 'Mills',
			phone: '123456',
			email: 'tg@gmail.com',
			username:'34567',
			password:'0000',
		})
		
		expect(rider1.status).toBe('offline')
	})
})
