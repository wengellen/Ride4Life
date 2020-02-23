import mongoose from "mongoose";
import bcrypt from "bcrypt";
var SchemaTypes = mongoose.Schema;

const riderSchema = new mongoose.Schema(
  {
    location: {
        address: {type:String},
        coordinates: {
            type: [Number]
        }
    },
    connected:{
        type:Boolean,
        default:false
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
      avatar: {
        type: String,
        default:"https://i.pravatar.cc/60"
      },
      memberSince: { type:Date,  default: Date.now()},
      tripCompleted: {type: Number, default:0},
      rating: {type: Number, default:0},
      numRideRated:{type:Number, default:0},
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
          default: 'rider',
      },
      description:{
          type:String,
      }
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
