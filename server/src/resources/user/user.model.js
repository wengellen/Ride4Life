import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: "true"
    },
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
          enum: ['admin'],
          default: 'admin',
      },
  },
  
  { timestamps: true }
);

userSchema.pre('save', function(next) {
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

userSchema.methods.checkPassword = function(password) {
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

export const User = mongoose.model("user", userSchema);
