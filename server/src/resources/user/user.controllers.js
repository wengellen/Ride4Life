import { User } from './user.model'

export const getAccount = (req, res) => {
	res.status(200).json({ data: req.user })
}

export const updateAccount = (req, res) => {
	console.log('updateAccount')
}

// export const createOne = async (req, res) => {
// 	const driver = await User.create(req.body)
// 	res.status()
// }

