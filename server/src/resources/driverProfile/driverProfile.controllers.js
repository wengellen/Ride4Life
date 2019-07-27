import { Driver } from './driverProfile.model'

export const getOne = (req, res) => {
  res.status(200).json({ data: req.driver })
}

export const updateOne = (req, res) => {
  console.log('updateOne')
}

export const createOne = async (req, res) => {
  console.log('req.body',req.body)
  const driver = await Driver.create(req.body)
  console.log('driver', driver)
}

