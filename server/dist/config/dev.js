"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
const config = {
  secrets: {
    jwt: 'ride4life'
  },
  dbUrl: 'mongodb://localhost:27017/ride4life-dev' // dbUrl: 'mongodb://heroku_xkhtgd8z:gek9247vvsftvicae94sask13a@ds261077.mlab.com:61077/heroku_xkhtgd8z'

};
exports.config = config;