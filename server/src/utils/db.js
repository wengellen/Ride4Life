import mongoose from 'mongoose'
import options from '../config'
import { Driver } from "../resources/driver/driver.model";

export const connect = (url = options.dbUrl, opts = {}) => {
	return mongoose.connect(
		url,
		{ ...opts,
		useNewUrlParser: true,
	    useCreateIndex: true  }
	)
}

export const fetchNearestCar = async (coordinates) => {
	try {
		const drivers = await Driver.find({status:"standby"}).lean().exec()
		return  drivers
	}catch(e){
		console.log(e)
	}
}
