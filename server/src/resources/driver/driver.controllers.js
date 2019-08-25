import { Driver } from './driver.model'
import { Trip } from '../trip/trip.model'
require('dotenv').config()

import cloudinary from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})


export const getMe = (req, res) => {
    res.status(200).send(req.user)
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

export const updateDriverProfile = (req, res) => {}

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

export const uploadProfilePhoto = async (req, res) => {
    const values = Object.values(req.files)
    
    const promises = values.map(image => cloudinary.uploader.upload(image.path))
    //
    Promise
    .all(promises)
    .then(results => res.json(results))
    .catch((err) => res.status(400).json(err))
}
