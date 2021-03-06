import { Trip } from './trip.model'
import router from "./trip.router";
import {Driver} from "../driver/driver.model";

export const getTrips = async (req, res) => {
	try {
	 	const trips = await Trip
					.find()
					.exec()
					
		if (!trips){
			return  res.status(400).send()
		}
		
		return res.status(200).json({data:trips})
	}
	catch(e){
		return res.status(400).send(e)
	}
}

export const updateTrip = async(req, res) => {
}

export const getTripById = async (req, res) => {

}

export const getTripByRiderId = async (req, res) => {
	const {rider} = req.body
	try {
		const trip = await Trip.findOneAndUpdate({ rider})
		.exec()
		res.status(200).json( trip )
	} catch (e) {
		res.status(500).json({ error: e })
	}
}

export const requestTrip = async (req, res) => {
	const rider = req.user._id
	console.log('rider')
	try {
		const trip = await Trip.create({...req.body, rider})
		res.status(201).json({data: trip})
	}
	catch(e){
		return res.status(400).send(e)
	}
}
