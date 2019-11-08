import { Rider } from "../rider/rider.model";
import { Trip } from "../trip/trip.model";
import {Driver} from "../driver/driver.model";


export const getMe = (req, res) => {
  res.status(200).send(req.user);
};

export const getAllRiders = async (req, res) => {
  try {
    const riders = await Rider.find().lean().exec();

    res.status(200).json({ data: riders });
  } catch (e) {
    res.status(500).send(  e );
  }
};

export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().exec();
    res.status(200).json({ data: drivers });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
    // .populate("rider")
    // .populate('driver')
    .exec();
    res.status(200).json({ data: trips });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};


