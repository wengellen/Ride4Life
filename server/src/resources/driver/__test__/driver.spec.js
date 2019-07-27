const Driver = require('../driver.model')

describe('Driver model', () => {
	test('email must be required', async () => {
		expect.assertions(1)
		try {
			await Driver.create({
				password: '1234'
			})
		} catch (e) {
			expect(e).toBeTruthy()
		}
	})
})
