import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
      requestTime:{
        type:Date,
        required:true,
        default:"2016-10-31T12:12:37.321Z"
      },
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
      enum: ["requesting","cancelledByDriver", "cancelledByRider", "accepted", "pickingUp", "enRoute"],
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
    tripRating:{
        type: Number,
        default: 5
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
