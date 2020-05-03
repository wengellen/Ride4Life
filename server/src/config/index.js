import { merge } from 'lodash'
require('dotenv').config()
const env = process.env.NODE_ENV || 'development'

const getDbURL = ()=>{
  switch (env) {
    case 'development':
      return process.env.DB_URL_DEV
    case 'testing':
        return process.env.DB_URL_TESTING
    default:
      return process.env.DB_URL_PRODUCTION
  }
}

const baseConfig = {
  env,
  dbUrl:getDbURL(),
  port: process.env.PORT || 7000,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: process.env.JWT_EXP || '1d'
  }
}

let envConfig = {}

export default merge(baseConfig, envConfig)
