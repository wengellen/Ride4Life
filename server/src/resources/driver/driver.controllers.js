import { Driver } from './driver.model'
import { Rider } from '../rider/rider.model'
import { Trip } from '../trip/trip.model'
import {crud} from './driver.crud'
require('dotenv').config()



export const getMe = (req, res) => {
    res.status(200).send(req.user)
}


export const reviewTrip = async (req, res)=>{
    const {driver_id, rider_id, trip_id, review, rating} = req.body
    try{
        const tripFound = await Trip.findById(trip_id).exec()
        if (tripFound.rated){
            console.log('"This trip has been reviewed"')
            return  res.status(404).json({ data: "This trip has been reviewed"});
        }
        
        const trip = await Trip.findByIdAndUpdate(
            trip_id,
            { tripRating: parseInt(rating), review, rated:true},
            {new:true})
        .populate("driver")
        .populate("rider")
        .exec();
    
        const rider = await Rider.findById(rider_id).exec()
        
        let currentNumRatedTrip = rider.numRideRated;
        let currentRating = rider.rating;
        let ratingTripTotal = parseFloat((currentNumRatedTrip * currentRating) + rating)
        let newNumRatedTrip = parseInt(currentNumRatedTrip + 1);
        let averageTripRating = parseFloat(ratingTripTotal/newNumRatedTrip).toFixed(2)
        console.log("rider", rider);
		console.log("currentNumRatedTrip", currentNumRatedTrip);
		console.log("currentRating", currentRating);
		console.log("ratingTripTotal", ratingTripTotal);
		console.log("averageTripRating", averageTripRating);
        const updateRider = await Rider.findByIdAndUpdate(
            rider_id,
            {  $inc: { tripCompleted: 1, numRideRated: 1}, rating:averageTripRating},
            {new:true})
        .exec();
        
        console.log('updateRider', updateRider)
        res.status(200).json({ data: {trip,  rider:updateRider}});
    }catch (e) {
        res.status(500).json({ error: e });
    }
}

export const getDriverById = async (req, res) => {
    try {
        const driver = await Driver.findOne({_id:req.params.id})
                                    .lean()
                                    .exec()
            console.log('driver',driver)
        res.status(200).json( driver )
    } catch (e) {
        res.status(500).json({ error: e })
    }
}

export const getDriverTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ driver: req.user._id })
            .populate('driver')
            .exec()
        res.status(200).json( trips )
    } catch (e) {
        res.status(500).json({ error: e })
    }
}

export const updateDriverLocation = async (req, res) => {
    const { coordinates } = req.body
    console.log('coordinates', coordinates)
    try {
        const driver = await Driver.findByIdAndUpdate(
            req.user._id,
            { location: { coordinates }, status: 'standby' },
            { new: true }
        ).exec()

        if (!!driver) {
            res.status(200).json({ data: driver })
        } else {
            res.status(404).json({ data: 'this record does not exist' })
        }
    } catch (e) {
        res.status(500).json({ error: e })
    }
}

export const quoteTrip = async (req, res) => {
    const { tripId, quote } = req.body
    console.log('')
    try {
        const trip = await Trip.findByIdAndUpdate(
            tripId,
            { driver: req.user._id, quote },
            { new: true }
        )
            .populate('rider')
            .populate('driver')
            .exec()
        res.status(201).json({ data: trip })
    } catch (e) {
        return res.status(400).send(e)
    }
}

export const updateProfile = async (req, res) => {
    console.log(".req.body", req.body)
    console.log("req.user._id", req.user._id)
    try {
        const driver = await Driver.findByIdAndUpdate(
            req.user._id,
            {...req.body},
            { new: true }
        ).exec()
        
        console.log('driver',driver)
        if (!driver){
            res.status(403).json({ message: 'No driver found'})
        }
        res.status(200).json(driver);
    } catch (e) {
        res.status(500).json({ error: e })
    }
}

export const uploadProfilePhoto = async (req, res) => {
    console.log("req", req)
    const values = Object.values(req.files)
    
    const promises = values.map(image => cloudinary.uploader.upload(image.path))
    
    Promise
    .all(promises)
    .then(async(results) => {
        console.log('results',results)
        try {
            const driver = await Driver.findByIdAndUpdate(
                req.user._id,
                { avatar:results[0].url},
                { new: true }
            ).exec()
            res.json({data:driver})
        } catch (e) {
            res.status(500).json({ error: e })
        }
    })
    .catch((err) => res.status(400).json(err))
}

export const getNearbyOnlineDrivers = async (req, res) => {
    console.log("getNearbyOnlineDrivers")
    const drivers = await crud.getNearbyOnlineDrivers()
    res.status(200).json({drivers:drivers})
}
