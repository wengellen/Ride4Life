const DriverProfile = require('../driver.model')

describe('Driver model', () => {
	test('trip must be required', async () => {
		expect.assertions(1)
		try {
			await DriverProfile.create({
			})
		} catch (e) {
			expect(e).toBeTruthy()
		}
	})
})
