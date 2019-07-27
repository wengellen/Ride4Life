import mongoose from 'mongoose'

const driverSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true
		},
		firstName:{
			type:String,
			// required:true
		},
		lastName:{
			type:String,
			// required:true
		},
		password: {
			type: String,
			required: true
		},
		city:{
			type: String,
			// required: true
		},
		// vehicles:[{type:String}]
	},
	{ timestamps: true }
)

export const Driver = mongoose.model('driver', driverSchema)
