const User = require('../user.model')

describe('User Model', function () {
	test('email must be required', async () => {
		expect.assertions(1)
		try {
		 	const user = await User.create({
		 		password:'1234'
		 	})
		}
		catch(e){
		   console.error(e)
		   expect(e).toBeTruthy()
		}
	})
});
