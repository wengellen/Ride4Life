import mongoose from 'mongoose'

const driverProfileSchema = new mongoose.Schema(
	{
		firstName:{
			type:String,
			required:true
		},
		lastName:{
			type:String,
			required:true
		},
		city:{
			type: String,
			required: true
		},
		vehicles:[{type:String}],
		user:{
			type:mongoose.SchemaTypes.ObjectId,
			ref:"user",
			required:true
		}
	},
	{ timestamps: true }
)

export const Driver = mongoose.model('driverProfile', driverProfileSchema)
