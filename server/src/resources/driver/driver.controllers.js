import { Driver } from "./driver.model";
import { Trip } from "../trip/trip.model";

export const getMe = (req, res) => {
  res.status(200).send(req.user);
};

export const getDriverProfile = (req, res) => {
  res.status(200).json({ data: req.user });
};

export const updateDriverProfile = (req, res) => {};

export const getDriverTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ driver: req.user._id })
      .populate("driver")
      .exec();
    res.status(200).json({ data: trips });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

export const updateDriverLocation = async (req, res) => {
  const { coordinates } = req.body;
  console.log('coordinates', coordinates)
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.user._id,
      { location: { coordinates }, status:"standby" },
      { new: true }
    ).exec();

    if (!!driver) {
      res.status(200).json({ data: driver });
    } else {
      res.status(404).json({ data: "this record does not exist" });
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

export const quoteTrip = async (req, res) => {
  const { tripId, quote } = req.body;
  console.log('')
  try {
    const trip = await Trip.findByIdAndUpdate(
      tripId,
      { driver: req.user._id, quote },
      { new: true }
    )
      .populate("rider")
      .populate("driver")
      .exec();
    res.status(201).json({ data: trip });
  } catch (e) {
    return res.status(400).send(e);
  }
};
