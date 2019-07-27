"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Driver = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const driverSchema = new _mongoose.default.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String // required:true

  },
  lastName: {
    type: String // required:true

  },
  password: {
    type: String,
    required: true
  },
  city: {
    type: String // required: true

  } // vehicles:[{type:String}]

}, {
  timestamps: true
});

const Driver = _mongoose.default.model('driver', driverSchema);

exports.Driver = Driver;