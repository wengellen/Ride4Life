import sio from 'socket.io'
import * as logger from './logger'
import { fetchNearestCops } from './utils/db'
import { Rider } from './resources/rider/rider.model'
import { Driver } from './resources/driver/driver.model'
import { Trip } from './resources/trip/trip.model'

let socketIo
const riders = new Map()
const drivers = new Map()
const trips = new Map()
const ids = new Map()
let nearbyOnlineDrivers = []
let nearbyOnlineDriversMap = new Map()
let requestInterval = null
let requestTimeout = null

export const io = function() {
    return socketIo
}

export const initialize = function(server) {
    socketIo = sio(server)
    socketIo.on('connection', socket => {
        logger.debug(`A user connected with ${socket.id}`)
        
        socket.on('disconnect', async reason => {
            console.log('ids.get(socket.id)',socket.id)
            const user = ids.get(socket.id)
            // const trip = trips.get(user.username)
            delete socket.id
            
            if (!user) return
            const map = user.role === 'rider' ? riders : drivers
            
            if ( user.role === 'rider'){
                try {
                    const res = await Rider
                                .findByIdAndUpdate(
                                    user.rider._id,
                                    { status: 'offline' },
                                    { new: true }
                                )
                                .exec()
                } catch (e) {
                    console.log('error', e)
                }
            }else{
                try {
                    const res = await Driver
                    .findByIdAndUpdate(
                        user.driver._id,
                        { status: 'offline' },
                        { new: true }
                    )
                    .exec()
                } catch (e) {
                    console.log('error', e)
                }
            }
            

            logger.debug('USER DISCONNECTED ' + user.username)
        })
        
        // socket.emit('',result)
        socket.on('join', function(data) {
            ids.set(socket.id, data)
            socket.join(data.username) //User joins a uniquyarn deve room/channel that's named after the userId
            console.log('User joined room: ' + data.username)
        })
        

        socket.on('UPDATE_DRIVER_LOCATION', async data => {
            logger.debug(
                `UPDATE_DRIVER_LOCATION triggered for ${data.username}`
            )
            drivers.set(data.username, {
                socketId: socket.id,
                ...data,
            })
            console.log('data', data)
            const { coordinates } = data

            try {
                const driver = await Driver.findByIdAndUpdate(
                    data.driver._id,
                    { location: { coordinates } },
                    { new: true }
                ).exec()
            } catch (e) {
                console.log('error', e)
            }
            ids.set(socket.id, data)
            socket.join(data.username)
        })

        socket.on('DRIVER_GO_ONLINE', async data => {
            logger.debug(
                `DRIVER_GO_ONLINE triggered for ${data.driver.username}`
            )
            try {
                const driver = await Driver.findByIdAndUpdate(
                    data.driver._id,
                    { status: 'standby' },
                    { new: true }
                ).exec()
                logger.debug(`DRIVER_READY_TO_ACCEPT_TRIP`)
                socketIo.sockets
                    .to(data.driver.username)
                    .emit('DRIVER_READY_TO_ACCEPT_TRIP')
            } catch (e) {
                console.log('error', e)
            }
        })

        socket.on('DRIVER_GO_OFFLINE', async data => {
            logger.debug(
                `DRIVER_GO_OFFLINE triggered for ${data.driver.username}`
            )
    
            const tripId = nearbyOnlineDriversMap.get(data.driver.username)
            try {
                const driver = await Driver.findOneAndUpdate(
                    {_id: data.driver._id},
                    { status: 'offline' },
                    { new: true }
                ).exec()
           
                socketIo.to(tripId).emit('DRIVER_GO_OFFLINE', data)
                
                console.log('DRIVER_GO_OFFLINE data',data)
                console.log('DRIVER_GO_OFFLINE driver',driver)
                socketIo.sockets
                .to(data.driver.username)
                .emit('DRIVER_GONE_OFFLINE')
                
                console.log('tripId', tripId)
                console.log(socketIo.sockets.adapter.rooms)
                socket.leave(tripId)
    
            } catch (e) {
                console.log('error', e)
            }
        })

        socket.on('UPDATE_RIDER_LOCATION', async data => {
            logger.debug(`UPDATE_RIDER_LOCATION triggered for ${data.username}`)
            riders.set(data.username, {
                socketId: socket.id,
                ...data,
            })
            const { coordinates } = data
            try {
                const rider = await Rider.findByIdAndUpdate(
                    data.rider._id,
                    { location: { coordinates }, status: 'standby' },
                    { new: true }
                ).exec()
            } catch (e) {
                console.log('error', e)
            }
            ids.set(socket.id, data)
            socket.join(data.username)
        })

        socket.on('RIDER_REQUEST_TRIP', async data => {
            const { username, _id } = data.rider
            let newTrip, trip
            logger.debug(`REQUEST_TRIP triggered for ${username}`)
    
            try {
                nearbyOnlineDrivers = await Driver.find({status:"standby"}).lean().exec()
               
            }catch(e){
                console.log(e)
            }
            
            try {
                newTrip = await Trip.create({ ...data, status: 'requesting' })
                trip = await Trip.findOne({ _id: newTrip._id })
                    .populate('rider')
                    .exec()
                
                console.log('trip', trip)
                socket.join(trip._id)
                socketIo.sockets.to(username).emit('TRIP_REQUESTED_BY_RIDER', trip._id)
            } catch (e) {
                console.log('there has been an error', e)
            }
            for (let driver of nearbyOnlineDrivers){
                console.log(
                    'DISPATCHING REQUEST_TRIP TO DRIVER - ',
                    driver.username
                )
                nearbyOnlineDriversMap.set( driver.username, trip._id)
                socketIo.sockets
                .in(driver.username)
                .emit('TRIP_REQUESTED_BY_RIDER', trip)
            }
         
            requestInterval =  setInterval(
                async () => {
                    let newRecords = await Driver.find({status:"standby"}).lean().exec()
                    for (let driver of newRecords){
                        console.log(
                            'DISPATCHING TRIP_REQUESTED_BY_RIDER TO DRIVER - ',
                            driver.username
                        )
                        if (!nearbyOnlineDriversMap.get(driver.username)){
                            socketIo.sockets
                            .to(driver.username)
                            .emit('TRIP_REQUESTED_BY_RIDER', trip)
                        }
                    }
                },
              2000)
    
            requestTimeout = setTimeout(() => {
                clearInterval(requestInterval)
                console.log(
                    'clearInterval - ',
                )
            },200000)
        })
    
        socket.on('DENY_TRIP_REQUEST', async data => {
            //take the driver out of
            // nearbyOnlineDriversMap.delete(drivers.username)
        })

        socket.on('RIDER_CANCEL_REQUEST', async data => {
            clearInterval(requestInterval)
    
            logger.debug(
                `RIDER_CANCEL_REQUEST triggered for tripId ${data.rider.username}`
            )
            try {
                const trip = await Trip.findOneAndRemove({
                    _id: data.tripId,
                }).exec()
    
                socketIo.sockets
                    .to(data.rider.username)
                    .emit('TRIP_REQUEST_CANCELED_BY_RIDER')
                socket.leave( data.tripId)
            
                for (let i = 0; i < nearbyOnlineDrivers.length; i++) {
                    console.log(
                        'DISPATCHING RIDER_REQUEST_CANCELED TO DRIVER - ',
                        nearbyOnlineDrivers[i].username
                    )
                    socketIo.sockets
                        .in(nearbyOnlineDrivers[i].username)
                        .emit('TRIP_REQUEST_CANCELED_BY_RIDER', data)
                        // socketIo.get(nearbyOnlineDrivers[i].username)
                }
            } catch (e) {
                console.log('error', e)
            }
    
        })

        socket.on('RIDER_CANCEL_TRIP', async data => {
            logger.debug(
                `RIDER_CANCEL_REQUEST triggered for tripId ${data.rider.username}`
            )
            try {
                const trip = await Trip.findOneAndUpdate(
                    { _id: data.tripId },
                    { status: 'cancelled' }
                ).exec()
                
                const driver = await Driver.findOneAndUpdate(
                    { _id: data.driver._id },
                    { status: 'standby' }
                ).exec()
                
                socketIo.sockets
                    .to(data.rider.username)
                    .emit('TRIP_CANCELED_BY_RIDER')
    
                socket.leave( data.tripId)
    
            } catch (e) {
                console.log('error', e)
            }
            socketIo.to(data.tripId).emit('TRIP_CANCELED_BY_RIDER', data)
        })

        socket.on('DRIVER_CANCEL_TRIP', async data => {
            logger.debug(
                `DRIVER_CANCEL_TRIP triggered for tripId ${data.driver.username}`
            )
            try {
                const trip = await Trip.findOneAndUpdate(
                    { _id: data.tripId },
                    { status: 'cancelled' }
                ).exec()
                
                const driver = await Driver.findOneAndUpdate(
                    { _id: data.driver._id },
                    { status: 'standby' }
                ).exec()

                socketIo.sockets
                    .to(data.driver.username)
                    .emit('TRIP_CANCELED_BY_DRIVER')
    
                socket.leave( data.tripId)
            } catch (e) {
                console.log('error', e)
            }
            socketIo.to(data.tripId).emit('TRIP_CANCELED_BY_DRIVER', data)
        })

        // Driver can accept trip
        socket.on('DRIVER_ACCEPT_TRIP', async data => {
            clearInterval(requestInterval)
            const { driver, rider } = data
            console.log('data._id', data._id)
            socket.join(data._id)
            try {
                const who = await Driver.findByIdAndUpdate(
                    driver._id,
                    { new: true }
                ).exec()
            } catch (e) {
                console.log('error', e)
            }
            // let clients =  socketIo.sockets.adapter.rooms[data._id].sockets;
            // console.log('!!!clients',clients)
            socketIo.sockets
                .to(rider.username)
                .emit('TRIP_ACCEPTED_BY_DRIVER', { ...data, quote: 20 })
        })

        // Rider can confirm trip
        socket.on('CONFIRM_TRIP', async data => {
            const { driver, rider, driverId, driverUsername } = data
            let trip
            socket.join(rider.username)
            try {
                trip = await Trip.findOneAndUpdate(
                    { rider: rider._id },
                    { driver: driverId, status: 'pickingUp' },
                    { new: true }
                )
                    .populate('rider')
                    .populate('driver')
                    .exec()
    
                for (let i = 0; i < nearbyOnlineDrivers.length; i++) {
        
                    if (nearbyOnlineDrivers[i].username === driverUsername) {
                        console.log(
                            'DISPATCHING TRIP_CONFIRMED to dirver - ',
                            nearbyOnlineDrivers[i].username
                        )
                        logger.debug(
                            `DISPATCHING TRIP_CONFIRMED to dirver -  ${data.driver.username}`
                        )
                        socketIo.sockets
                        .in(driverUsername)
                        .emit('TRIP_CONFIRMED_BY_RIDER', data)
            
                    } else {
                        console.log(
                            'TRIP_REQUEST_CANCELED_BY_RIDER to dirver - ',
                            nearbyOnlineDrivers[i].username
                        )
                        logger.debug(
                            `TRIP_REQUEST_CANCELED_BY_RIDER to dirver -  ${data.driver.username}`
                        )
                        socketIo.sockets
                        .in(nearbyOnlineDrivers[i].username)
                        .emit('TRIP_REQUEST_CANCELED_BY_RIDER', data)
                    }
                }
            } catch (e) {
                console.log('there has been an error', e)
            }
        })
    
    
        // Driver can start trip
        socket.on('DRIVER_START_TRIP', async data => {
            const { driver, rider } = data
            let trip
            socket.join(data._id)
            console.log('DRIVER_START_TRIP ------>')
            console.log('data', data)
            console.log('driver', driver)
            console.log('rider', rider)
           // send heartbeat and update driver location
            try {
                const driver = await Driver.findOneAndUpdate(
                    { _id: data.driver._id },
                    { status: 'enRoute' }
                ).exec()
    
    
                const rider = await Rider.findOneAndUpdate(
                    { _id: data.rider._id },
                    { status: 'enRoute' }
                ).exec()
            
                await Trip.findOneAndUpdate(
                    { rider: data.rider._id },
                    { status: 'enRoute' },
                    { new: true }
                )
                .populate('rider')
                .populate('driver')
                .exec()
                
                // const who = await Driver.findByIdAndUpdate(
                //     driver._id,
                //     { new: true }
                // ).exec()
                // // let clients =  socketIo.sockets.adapter.rooms[data._id].sockets;
                // // console.log('!!!clients',clients)
                // console.log('who', who)
                socketIo.sockets
                .to(rider.username)
                .emit('TRIP_STARTED_BY_DRIVER', { ...data})
                
            } catch (e) {
                console.log('error', e)
            }
           
        })
    
        // Driver can end trip
        socket.on('DRIVER_END_TRIP', async data => {
            const { driver, rider } = data
            let trip
            socket.join(data._id)
            console.log('DRIVER_END_TRIP ------>')
            console.log('data', data)
            console.log('driver', driver)
            console.log('rider', rider)
            // send heartbeat and update driver location
            try {
                const driver = await Driver.findOneAndUpdate(
                    { _id: data.driver._id },
                    { status: 'standby' }
                ).exec()
            
            
                const rider = await Rider.findOneAndUpdate(
                    { _id: data.rider._id },
                    { status: 'standby' }
                ).exec()
            
                await Trip.findOneAndUpdate(
                    { rider: data.rider._id },
                    { status: 'ended' },
                    { new: true }
                )
                .populate('rider')
                .populate('driver')
                .exec()
            
                // const who = await Driver.findByIdAndUpdate(
                //     driver._id,
                //     { new: true }
                // ).exec()
                // // let clients =  socketIo.sockets.adapter.rooms[data._id].sockets;
                // // console.log('!!!clients',clients)
                // console.log('who', who)
                socketIo.sockets
                .to(rider.username)
                .emit('TRIP_ENDED_BY_DRIVER', { ...data})
            
            } catch (e) {
                console.log('error', e)
            }
        
        })
    })

    return socketIo
}
