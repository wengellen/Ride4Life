import mongoose from 'mongoose'
import cuid from 'cuid'
import {connect} from './src/utils/db'

const url = 'mongodb://localhost:27017/'
const databaseName = 'intro-mongodb-testing'

async function removeAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany()
  }
}

global.newId = () => {
  return mongoose.Types.ObjectId()
}

beforeAll(async () => {
  const url = `mongodb://localhost:27017/${databaseName}`
  await mongoose.connect(url, { useNewUrlParser: true })
})

beforeEach(async () => {

})

afterEach(async () => {
  await removeAllCollections()
})

afterAll(done => {
  return done()
})
