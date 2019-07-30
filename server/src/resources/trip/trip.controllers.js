import { Trip } from './trip.model'
import router from "./trip.router";

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

export const updateTrip = (req, res) => {
}

export const getTripById = async (req, res) => {
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
