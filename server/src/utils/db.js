import mongoose from 'mongoose'
import options from '../config'
import { Driver } from "../resources/driver/driver.model";

export const connect = (url = options.dbUrl, opts = {}) => {
	console.log('options.dbUrl',options.dbUrl)
	return mongoose.connect(
		url,
		{ ...opts,
		useNewUrlParser: true,
	    useCreateIndex: true  }
	)
}

export const fetchNearestCops = async (coordinates) => {
	try {
		const drivers = await Driver.find({status:"standby"}).lean().exec()
		return  drivers
	 }catch(e){
			console.log(e)
	 }
 }
