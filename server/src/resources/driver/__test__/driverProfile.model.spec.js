// const DriverProfile = require('../driver.model')

import {Driver} from '../driver.model'


describe('Driver model', () => {
	test('trip must be required', async () => {
		expect.assertions(1)
		try {
			await Driver.create({
			})
		} catch (e) {
			expect(e).toBeTruthy()
		}
	})
	
	test('betaUser should default to offline', async () => {
		const driver1 = await Driver.create({
			firstName: 'Tilly',
			lastName: 'Mills',
			phone: '123456',
			email: 'tg@gmail.com',
			username:'12345',
			password:'0000',
			city:'city'
		})
		
		expect(driver1.status).toBe('offline')
	})
})
