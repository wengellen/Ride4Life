import mongoose from "mongoose";
import bcrypt from "bcrypt";
var SchemaTypes = mongoose.Schema.Types;

const geoSchema = new mongoose.Schema({
	type: {
		type: String,
		default: "Point"
	},
	address: { type: String },
	coordinates: {
		type: [Number]
	},
});
const driverSchema = new mongoose.Schema(
	{
		vehicle: {
			image:{ type: String,default: "https://i.pravatar.cc/60"},
			brand:{type:String, default:"BMW"}
		},
		connectedSocket:{
			type:String,
			default:null
		},
		location: {
			address: { type: String },
			coordinates: []
		},
		// location: geoSchema,
		status: {
			type: String,
			required: true,
			enum: ["offline", "standby", "offered", "enRoute"],
			default: "offline"
		},
		active: {
			type: Boolean,
			default: "true"
		},
		avatar: {
			type: String
		},
		memberSince: {
			type: Date,
			default: Date.now()
		},
		tripCompleted: {
			type: Number,
			default: 0
		},
		rating: {
			type: Number,
			default: 0
		},
		numRideRated: {
			type: Number,
			default: 0
		},
		firstName: {
			type: String
		},
		lastName: {
			type: String
		},
		city: {
			type: String,
			required: true
		},
		// Account info
		username: {
			type: String,
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		phone: {
			type: String,
			required: true
		},
		email: {
			type: String,
			unique: true,
			trim: true,
			required: true
		},
		role: {
			type: String,
			required: true,
			enum: ["driver", "rider"],
			default: "driver"
		}
	},
	{ timestamps: true }
);

driverSchema.pre("save", function(next) {
	if (!this.isModified("password")) {
		return next();
	}

	bcrypt.hash(this.password, 8, (err, hash) => {
		if (err) {
			return next(err);
		}

		this.password = hash;
		next();
	});
});

driverSchema.methods.checkPassword = function(password) {
	const passwordHash = this.password;
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, passwordHash, (err, same) => {
			if (err) {
				return reject(err);
			}
			resolve(same);
		});
	});
};

// geoSchema.index({coordinates:1})
driverSchema.index({ 'location': "2dsphere" });

export const Driver = mongoose.model("driver", driverSchema);

