import { Rider } from "./rider.model";
import { Trip } from "../trip/trip.model";
import {Driver} from "../driver/driver.model";


export const getMe = (req, res) => {
  res.status(200).send(req.user);
};

export const getRiderProfile = (req, res) => {
  res.status(200).json({ data: req.user });
};

export const updateRiderProfile = (req, res) => {
};


export const getRiderTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ rider: req.user._id })
    .populate("rider")
    .exec();
    res.status(200).json({ data: trips });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

export const updateRiderLocation = async (req, res) => {
  const { coordinates } = req.body;
  console.log('coordinates', coordinates)

  try {
    const rider = await Rider.findByIdAndUpdate(
          req.user._id ,
      { location: { coordinates } },
        {new:true}
    ).exec();
    if (!!rider){
      res.status(200).json({data: rider})
    }else{
      res.status(404).json({ data: 'this record does not exist' });
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};

export const requestTrip = async (req, res) => {
  const rider = req.user._id
  try {
    const trip = await Trip.create({...req.body, rider})
    res.status(201).json({data: trip})
  }
  catch(e){
    return res.status(400).send(e)
  }
}

export const fetchNearestDriver = async (req, res) => {
  const {coordinates, user} = req.body
  try {
    const drivers = await Driver.find({status:"standby"}).lean().exec()
    res.status(200).json(drivers);
  } catch (e) {
    res.status(500).json(e);
  }
}

export const uploadProfile = async (req, res) => {
  console.log(".req.body", req.body)
  console.log("req.user._id", req.user._id)
  
  try {
    const rider = await Rider.findByIdAndUpdate(
        req.user._id,
        {...req.body},
        { new: true }
    ).exec()
    if (!rider){
      res.status(403).json({ message: 'No account found'})
    }
    console.log('rider',rider)
    res.status(200).json(rider);
  } catch (e) {
    res.status(500).json({ error: e })
  }
}
