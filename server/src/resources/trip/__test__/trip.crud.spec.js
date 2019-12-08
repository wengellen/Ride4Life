
import {Rider} from '../../rider/rider.model'
import {Driver} from '../../driver/driver.model'
import {Trip} from '../trip.model'
import {crud} from '../trip.crud'
import { app } from '../../../server'
import * as logger from '../../../logger'
import sio from 'socket.io'
import io from 'socket.io-client'



describe('TRIP crud', () => {
    let rider
    let driver
    
    beforeAll(async() => {
         driver = await Driver.create({
            firstName: 'Tilly',
            lastName: 'Mills',
            phone: '123456',
            email: 'tg@gmail.com',
            username:'12345',
            password:'0000',
            city:'city'
        })
         rider = await Rider.create({
            firstName: 'Tilly',
            lastName: 'Mills',
            phone: '123456',
            email: 'tg@gmail.com',
            username:'34567',
            password:'0000',
        })
    });
    
    afterAll(async() => {
    });
    
    beforeEach(async() => {
    });
    describe('getRiderById', () => {
        test('Create a trip', async () => {
            const trip =  await Trip.create({
                    location:'12345',
                    startLocation:'12345',
                    endLocation: 'sasha@gmail.com',
                    startLocationAddress:'12345',
                    endLocationAddress: 'sasha@gmail.com',
                    rider:rider.id,
                    driver:driver.id,
                    review:'1234',
                    tripRating:5,
                    tripFare:40,
                    quote:30,
                    baseFare:10,
                    distance:10,
                    duration:10
                })
            const match = await crud.getById(trip.id)
            expect(match.id).toBe(trip.id)
        })
    })
    describe('getAllTrips', () => {
        test('get all users in the DB', async () => {
            const tripsToCreate = [
                {
                    location:'12345',
                    startLocation:'12345',
                    endLocation: 'sasha@gmail.com',
                    startLocationAddress:'12345',
                    endLocationAddress: 'sasha@gmail.com',
                    rider:rider.id,
                    driver:driver.id,
                    review:'1234',
                    tripRating:5,
                    tripFare:40,
                    quote:30,
                    baseFare:10,
                    distance:10,
                    duration:10
                },
                {
                    location:'12345',
                    startLocation:'12345',
                    endLocation: 'sasha@gmail.com',
                    startLocationAddress:'12345',
                    endLocationAddress: 'sasha@gmail.com',
                    rider:rider.id,
                    driver:driver.id,
                    review:'1234',
                    tripRating:5,
                    tripFare:40,
                    quote:30,
                    baseFare:10,
                    distance:10,
                    duration:10
                },
                {
                    location:'12345',
                    startLocation:'12345',
                    endLocation: 'sasha@gmail.com',
                    startLocationAddress:'12345',
                    endLocationAddress: 'sasha@gmail.com',
                    rider:rider.id,
                    driver:driver.id,
                    review:'1234',
                    tripRating:5,
                    tripFare:40,
                    quote:30,
                    baseFare:10,
                    distance:10,
                    duration:10
                },
            ]
            const trips = await Trip.create(tripsToCreate)
            const matchedUsers = await crud.getAll()
            expect(matchedUsers).toHaveLength(trips.length)
        })
    })
    describe('removeUserById', () => {
        test('remove user by id', async () => {
            const {id} = await Trip.create({
                location:'12345',
                startLocation:'12345',
                endLocation: 'sasha@gmail.com',
                startLocationAddress:'12345',
                endLocationAddress: 'sasha@gmail.com',
                rider:rider.id,
                driver:driver.id,
                review:'1234',
                tripRating:5,
                tripFare:40,
                quote:30,
                baseFare:10,
                distance:10,
                duration:10
            })
            await crud.removeById(id)
            const match = await Trip.findById(id).exec()
            expect(match).toBe(null)
        })
    })
    describe('updateById', () => {
        test('update user by id', async () => {
            const {id} = await Trip.create(
                {
                    location:'12345',
                    startLocation:'12345',
                    endLocation: 'sasha@gmail.com',
                    startLocationAddress:'12345',
                    endLocationAddress: 'sasha@gmail.com',
                    rider:rider.id,
                    driver:driver.id,
                    review:'1234',
                    tripRating:5,
                    tripFare:40,
                    quote:30,
                    baseFare:10,
                    distance:10,
                    duration:10
                })
            const user = await crud.updateById(id, {status: 'standby'})
            expect(user.id).toBe(id)
            expect(user.status).toBe('standby')
        })
    })
})
