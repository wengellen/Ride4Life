import sio from 'socket.io'
import * as logger from './logger'
import { fetchNearestCops } from './utils/db'
import { Rider } from './resources/rider/rider.model'
import { Driver } from './resources/driver/driver.model'
import {updateDriverLocation, updateDriverStatus, getDriverById} from './resources/driver/driver.crud'
import {updateRiderLocation, updateRiderStatus, updateRiderLocationAndStatus} from './resources/rider/rider.crud'
import { Trip } from './resources/trip/trip.model'
// import { getDriverById } from './resources/driver/driver.controllers'

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
        const username = socket.handshake.query.username
        const role = socket.handshake.query.role
        const connectedUser = {username,role}
        logger.debug(`USER CONNECTED - ${role} ${username} connected with ${socket.id}`)
        // console.log('socket.handshake.query.param',socket.handshake.query)
        
        socket.on('disconnect', async reason => {
            const user = ids.get(socket.id)
            // console.log(socket.handshake.query)
            // console.log(`User ${user.username} has been disconnected`,socket.id)
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
            // map socket id to user object
            ids.set(socket.id, data)
            
            // add a room with username
            socket.join(data.username) //User joins a uniquyarn deve room/channel that's named after the userId
            // use username as room name
            logger.debug(`USER JOINED ROOM:  ${data.username}`)
        })
    
        socket.on('UPDATE_RIDER_LOCATION', async data => {
            const username = socket.handshake.query.username
            // console.log
            logger.debug(`UPDATE_RIDER_LOCATION - ${username}`)
            // const role = socket.handshake.query.role
            const {location, role, riderUsername, riderId} = data;
            
            logger.debug(`UPDATE_RIDER_LOCATION - ${riderUsername}`)
            riders.set(riderUsername, {
                socketId: socket.id,
                ...data,
            })
            try {
                await updateRiderLocationAndStatus(riderId, location, 'standby');
            } catch (e) {
                console.log('error', e)
            }
            ids.set(socket.id, data)
            socket.join(riderUsername)
        })
    
    
        socket.on('UPDATE_DRIVER_LOCATION', async data => {
            const {location, role, driverUsername, driverId } = data
           
            // map driver username to socket
            drivers.set(driverUsername, {
                socketId: socket.id,
                ...data,
            })
            logger.debug(`UPDATE_DRIVER_LOCATION - ${driverUsername} data add to drivers map`, drivers.get(driverUsername))
    
            try {
                await updateDriverLocation(driverId, location)
            } catch (e) {
                console.log('error', e)
            }
            // map socket id to driver object
            ids.set(socket.id, data)
            
            // Put driver in a new chat room
            socket.join(driverUsername)
        })

        socket.on('DRIVER_GO_ONLINE', async data => {
            logger.debug(`DRIVER_GO_ONLINE - ${data.driver.username}`, data)
            try {
                // const driver = await updateDriverStatus(,  'standby')
                
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


        // There are
        socket.on('RIDER_REQUEST_TRIP', async data => {
            const { riderUsername, riderId } = data
            let newTrip, trip
            
            logger.debug(`REQUEST_TRIP triggered for ${riderUsername}`)
    
            try {
                nearbyOnlineDrivers = await Driver.find({status:"standby"}).lean().exec()
            }catch(e){
                console.log(e)
            }
            
            try {
                newTrip = await Trip.create({ ...data, status: 'requesting', rider: riderId})
                trip = await Trip.findOne({ _id: newTrip._id })
                    .populate('rider')
                    .exec()
                
                console.log('newTrip',newTrip)
                
                socket.join(trip._id)
                // Return trip id to rider
                socketIo.sockets.to(riderUsername).emit('TRIP_REQUESTED_BY_RIDER', trip._id)
            } catch (e) {
                console.log('there has been an error', e)
            }
            for (let driver of nearbyOnlineDrivers){
                console.log(
                    'DISPATCHING REQUEST_TRIP TO DRIVER - ',
                    driver.username
                )
                nearbyOnlineDriversMap.set( driver.username, trip._id)
                
                // RETURNING TRIP info to DRIVER
                socketIo.sockets
                .in(driver.username)
                .emit('TRIP_REQUESTED_BY_RIDER', trip)
            }
            //
            // requestInterval =  setInterval(
            //     async () => {
            //         let newRecords = await Driver.find({status:"standby"}).lean().exec()
            //         for (let driver of newRecords){
            //             console.log(
            //                 'DISPATCHING TRIP_REQUESTED_BY_RIDER TO DRIVER - ',
            //                 driver.username
            //             )
            //             if (!nearbyOnlineDriversMap.get(driver.username)){
            //                 socketIo.sockets
            //                 .to(driver.username)
            //                 .emit('TRIP_REQUESTED_BY_RIDER', trip)
            //             }
            //         }
            //     },
            //   2000)
            //
            // requestTimeout = setTimeout(() => {
            //     clearInterval(requestInterval)
            //     console.log(
            //         'clearInterval - ',
            //     )
            // },200000)
        })
    
        // Driver can accept trip
        socket.on('DRIVER_ACCEPT_TRIP', async data => {
            clearInterval(requestInterval)
            const { driver, rider } = data
            console.log('data', data)
            
            // JOIN TRIP_ID CHAT ROOM
            socket.join(data._id)
            
            try {
                // UPDATE DRIVER STATUS
                const who = await Driver.findByIdAndUpdate(
                    driver._id,
                    {status:'offered'},
                    { new: true }
                ).exec()
    
    
                // SEND QUOTE TO RIDER
                socketIo.sockets
                .to(rider.username)
                .emit('TRIP_ACCEPTED_BY_DRIVER', { ...data, quote: 20 })
                
            } catch (e) {
                console.log('error', e)
            }
        })

        // Rider can confirm trip
        socket.on('CONFIRM_TRIP', async data => {
            const { driver, rider, driverId, driverUsername } = data
            let trip
            socket.join(data._id)
            // socket.join(rider.username)
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
            // socket.join(data._id)
            // socket.join(data._id)
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
    
                socket.leave(data._id)
            } catch (e) {
                console.log('error', e)
            }
        
        })
    
        socket.on('DENY_TRIP_REQUEST', async data => {
            //take the driver out of
            // nearbyOnlineDriversMap.delete(drivers.username)
        })
    
        socket.on('RIDER_CANCEL_REQUEST', async data => {
            // clearInterval(requestInterval)
        
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
    
    })

    return socketIo
}
