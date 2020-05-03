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
