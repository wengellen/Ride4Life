import mongoose from "mongoose";
import bcrypt from "bcrypt";

const riderSchema = new mongoose.Schema(
  {
    location: {
        type: {
            type: String,
            default:"Point"
        },
        address: {type:String},
        coordinates: {
            type: [Number]
        }
    },
    status: {
      type: String,
      required: true,
      enum: ["offline","standby", "waiting", "enRoute"],
      default: "offline"
    },
    active: {
      type: Boolean,
      default: "true"
    },
      // Profile info
      avatar: { type: String },
      memberSince: { type: Date },
      tripCompleted: {type: Number},
      rating: {type: Number},
      numRiderRated:{type:Number},
      // Account info
      username:{
          type: String,
          unique: true,
          required: true,
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
          required: true,
      },
      role:{
          type:String,
          required:true,
          enum: ['driver', 'rider'],
          default: 'rider',
      },
  },
  
  { timestamps: true }
);

riderSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next()
    }
    
    bcrypt.hash(this.password, 8, (err, hash) => {
        if (err) {
            return next(err)
        }
        
        this.password = hash
        next()
    })
})

riderSchema.methods.checkPassword = function(password) {
    const passwordHash = this.password
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, passwordHash, (err, same) => {
            if (err) {
                return reject(err)
            }
            resolve(same)
        })
    })
}

riderSchema.index({ location: "2dsphere" });

export const Rider = mongoose.model("rider", riderSchema);
