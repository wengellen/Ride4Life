import { merge } from 'lodash'
const env = process.env.NODE_ENV || 'development'
console.log('env',env)
const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  port:  process.env.PORT || 7000,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: '100d'
  }
}

let envConfig = {}

switch (env) {
  case 'PRODUCTION':
    console.log('production envConfig',envConfig)
    envConfig = require('./prod').config
    break
  case 'development':
    envConfig = require('./dev').config
    break
  case 'test':
  case 'testing':
    envConfig = require('./testing').config
    break
  default:
    envConfig = require('./dev').config
}

export default merge(baseConfig, envConfig)
