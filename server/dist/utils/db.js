"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchNearestCops = exports.connect = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _config = _interopRequireDefault(require("../config"));

var _driver = require("../resources/driver/driver.model");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const connect = (url = _config.default.dbUrl, opts = {}) => {
  console.log('options.dbUrl', _config.default.dbUrl);
  return _mongoose.default.connect(url, _objectSpread({}, opts, {
    useNewUrlParser: true,
    useCreateIndex: true
  }));
};

exports.connect = connect;

const fetchNearestCops = async coordinates => {
  try {
    const drivers = await _driver.Driver.find({
      status: "standby"
    }).lean().exec();
    return drivers;
  } catch (e) {
    console.log(e);
  }
};

exports.fetchNearestCops = fetchNearestCops;