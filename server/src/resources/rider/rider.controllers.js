import { Rider } from './rider.model'
import router from "./rider.router";

export const getProfile = (req, res) => {
  res.status(200).json({ data: req.driver })
}

export const updateProfile = (req, res) => {
}

export const getHistory = async (req, res) => {
  // const rider = await Rider.create(req.body)
}
