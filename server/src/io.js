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

export const io = function() {
    return socketIo
}

export const initialize = function(server) {
    socketIo = sio(server)
    socketIo.on('connection', socket => {
        logger.debug(`A user connected with ${socket.id}`)

        socket.on('disconnect', async reason => {
            const user = ids.get(socket.id)
            logger.debug('ids ' + ids)
            const trip = trips.get(user.username)
            console.log('!!!trip', trip)

            logger.debug('USER DISCONNECTED ' + user.username)

            if (!user) return
            const model = user.role === 'rider' ? Rider : Driver
            try {
                const res = await model
                    .findByIdAndUpdate(
                        user._id,
                        { status: 'offline' },
                        { new: true }
                    )
                    .exec()
                console.log('res', res)
            } catch (e) {
                console.log('error', e)
            }
        })
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
            try {
                const driver = await Driver.findByIdAndUpdate(
                    data.driver._id,
                    { status: 'offline' },
                    { new: true }
                ).exec()

                socketIo.sockets
                    .to(data.driver.username)
                    .emit('DRIVER_GONE_OFFLINE')
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

        socket.on('REQUEST_TRIP', async data => {
            const { username, _id } = data.rider
            let newTrip, trip
            logger.debug(`REQUEST_TRIP triggered for ${username}`)
            nearbyOnlineDrivers = await fetchNearestCops(
                data.location.coordinates
            )

            try {
                newTrip = await Trip.create({ ...data, status: 'requesting' })
                trip = await Trip.findOne({ _id: newTrip._id })
                    .populate('rider')
                    .exec()

                socket.join(trip._id)
                socketIo.sockets.to(username).emit('TRIP_REQUESTED', trip._id)
            } catch (e) {
                console.log('there has been an error', e)
            }

            for (let i = 0; i < nearbyOnlineDrivers.length; i++) {
                console.log(
                    'DISPATCHING REQUEST_TRIP TO DRIVER - ',
                    nearbyOnlineDrivers[i].username
                )
                socketIo.sockets
                    .in(nearbyOnlineDrivers[i].username)
                    .emit('REQUEST_TRIP', trip)
            }
        })

        socket.on('RIDER_CANCEL_REQUEST', async data => {
            logger.debug(
                `RIDER_CANCEL_REQUEST triggered for tripId ${data.rider.username}`
            )

            try {
                const trip = await Trip.findOneAndRemove({
                    _id: data.tripId,
                }).exec()
                socketIo.sockets
                    .to(data.rider.username)
                    .emit('RIDER_REQUEST_CANCELED')
            } catch (e) {
                console.log('error', e)
            }

            for (let i = 0; i < nearbyOnlineDrivers.length; i++) {
                console.log(
                    'DISPATCHING RIDER_REQUEST_CANCELED TO DRIVER - ',
                    nearbyOnlineDrivers[i].username
                )
                socketIo.sockets
                    .in(nearbyOnlineDrivers[i].username)
                    .emit('RIDER_REQUEST_CANCELED', data)
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

                socketIo.sockets
                    .to(data.rider.username)
                    .emit('RIDER_TRIP_CANCELED')
            } catch (e) {
                console.log('error', e)
            }
            socketIo.to(data.tripId).emit('RIDER_TRIP_CANCELED', data)
        })

        // Driver can accept trip
        socket.on('ACCEPT_TRIP', async data => {
            const { driver, rider } = data
            socket.join(data._id)

            // let clients =  socketIo.sockets.adapter.rooms[data._id].sockets;
            // console.log('!!!clients',clients)
            socketIo.sockets
                .to(rider.username)
                .emit('ACCEPT_TRIP', { ...data, quote: 20 })
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
            } catch (e) {
                console.log('there has been an error', e)
            }

            for (let i = 0; i < nearbyOnlineDrivers.length; i++) {
                console.log(
                    'DISPATCHING RIDER_REQUEST_CANCELED TO DRIVER - ',
                    nearbyOnlineDrivers[i].username
                )
                if (nearbyOnlineDrivers[i].username === driverUsername) {
                    socketIo.sockets
                        .in(driverUsername)
                        .emit('CONFIRM_TRIP', data)
                } else {
                    socketIo.sockets
                        .in(nearbyOnlineDrivers[i].username)
                        .emit('RIDER_REQUEST_CANCELED', data)
                }
            }
        })
    })

    return socketIo
}
