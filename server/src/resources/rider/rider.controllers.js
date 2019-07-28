import { Rider } from './rider.model'

export const getOne = (req, res) => {
  res.status(200).json({ data: req.driver })
}

export const updateOne = (req, res) => {
}

export const createOne = async (req, res) => {
  const rider = await Rider.create(req.body)
}

