import { Driver } from './driver.model'

export const getOne = (req, res) => {
  res.status(200).json({ data: req.driver })
}

export const updateOne = (req, res) => {
}

