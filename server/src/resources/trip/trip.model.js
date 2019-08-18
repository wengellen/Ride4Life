import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
      startLocation:{
          type: { type: String },
          address: {type:String},
          coordinates: []
      },
      endLocation:{
          type: { type: String },
          address: {type:String},
          coordinates: []
      },

    address: {
        type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["requesting", "accepted", "pickingUp", "enRoute", "ended"],
      default: "requesting"
    },
    rider:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:'rider',
        required:true
    },
    driver:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:'driver',
    },
    review:{
        type: String,
    },
    tripRating:{
        type: Number,
        default: 5
    },
    tripFare:{
        type: Number,
        default: 0
    },
    quote:{
        type: Number,
    },
    baseFare:{
        type:Number,
    },
    distance:{
        type:Number,
    },
    duration:{
      type:Number,
    }
  },
  
  { timestamps: true }
);


export const Trip = mongoose.model("trip", tripSchema);
