"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = exports.app = void 0;

var _express = _interopRequireDefault(require("express"));

var logger = _interopRequireWildcard(require("./logger"));

var _http = _interopRequireDefault(require("http"));

var _io = require("./io");

var _bodyParser = require("body-parser");

var _expressFormData = _interopRequireDefault(require("express-form-data"));

var _morgan = _interopRequireDefault(require("morgan"));

var _config = _interopRequireDefault(require("./config"));

var _cors = _interopRequireDefault(require("cors"));

var _db = require("./utils/db");

var _auth = require("./utils/auth");

var _driver = _interopRequireDefault(require("./resources/driver/driver.router"));

var _rider = _interopRequireDefault(require("./resources/rider/rider.router"));

var _trip = _interopRequireDefault(require("./resources/trip/trip.router"));

var _user = _interopRequireDefault(require("./resources/user/user.router"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const app = (0, _express.default)();
exports.app = app;

const httpServer = _http.default.Server(app);

const globalSocket = (0, _io.initialize)(httpServer);
let corsOptions = {};
console.log('process.env.NODE_ENV', process.env.NODE_ENV); // if (process.env.NODE_ENV ==='PRODUCTION') {
// 	corsOptions = {
// 		origin: 'https://reverent-wozniak-c1db03.netlify.com/'
// 	}
//
// }else{
// 	corsOptions = {
// 		origin: 'http://localhost:3000'
// 	}
// }

app.disable('x-powered-by');
app.use((0, _cors.default)());
app.use((0, _bodyParser.json)());
app.use(_expressFormData.default.parse());
app.use((0, _bodyParser.urlencoded)({
  extended: true
}));
app.use((0, _morgan.default)('dev'));
app.post('/signup', _auth.signup);
app.post('/signin', _auth.signin);
app.use('/api', _auth.protect);
app.use('/api/rider', _rider.default);
app.use('/api/driver', _driver.default);
app.use('/api/trip', _trip.default);
app.use('/api/user', _user.default);

const start = async () => {
  try {
    await (0, _db.connect)();
    httpServer.listen(_config.default.port, () => {
      console.log(`REST API on http://localhost:${_config.default.port}`);
    });
  } catch (e) {
    console.error(e);
  }
};

exports.start = start;