import mongoose from "mongoose";
import bcrypt from "bcrypt";

const driverSchema = new mongoose.Schema(
  {
    vehicles: [{ type: String }],
    location: {
      type: { type: String },
      address: {type:String},
      coordinates: []
    },
    status: {
      type: String,
      required: true,
      enum: ["offline", "standby", "waiting", "enRoute"],
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
        type: Date
    },
    tripCompleted: {
        type: Number
    },
    rating: {
        type: Number
    },
    numRiderRated: {
        type: Number
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
      default: "rider"
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
export const Driver = mongoose.model("driver", driverSchema);
