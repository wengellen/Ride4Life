import { User } from './user.model'

export const getOne = (req, res) => {
	res.status(200).json({ data: req.user })
}

export const updateOne = (req, res) => {
	console.log('updateOne')
}

export const createOne = async (req, res) => {
	const driver = await User.create(req.body)
}

