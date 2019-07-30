import { Driver } from './driver.model'

export const getProfile = (req, res) => {
  res.status(200).json({ data: req.driver })
}

export const updateProfile = (req, res) => {
}

export const getTripHistory = async (req, res) => {
  const driver = await Driver.create(req.body)
}

export const updateCurrentLocation = async (req, res) => {
  // const rider = await Rider.create(req.body)
}
