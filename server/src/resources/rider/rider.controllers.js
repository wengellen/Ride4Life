import { Rider } from "./rider.model";
import { Trip } from "../trip/trip.model";


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
