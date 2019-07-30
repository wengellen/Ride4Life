import { Rider } from "./rider.model";
import router from "./rider.router";

export const getProfile = (req, res) => {
  res.status(200).json({ data: req.driver });
};

export const updateProfile = (req, res) => {};

export const getTripHistory = async (req, res) => {
  // const rider = await Rider.create(req.body)
};

export const updateLocation = async (req, res) => {
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
