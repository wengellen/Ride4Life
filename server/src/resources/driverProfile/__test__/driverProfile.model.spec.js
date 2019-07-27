const DriverProfile = require('../driverProfile.model')

describe('Driver model', () => {
	test('user must be required', async () => {
		expect.assertions(1)
		try {
			await DriverProfile.create({
			})
		} catch (e) {
			expect(e).toBeTruthy()
		}
	})
})
