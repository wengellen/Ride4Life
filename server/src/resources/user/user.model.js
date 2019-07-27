import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true
		},
		password: {
			type: String,
			required: true
		},
		role:{
			enum: ['driver', 'rider']
		}
	}
)


export const User = mongoose.model('user', userSchema)
