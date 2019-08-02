import sio from 'socket.io'
import * as logger  from './logger'
import {fetchNearestCops} from "./utils/db";
import {Rider} from "./resources/rider/rider.model";

let socketIo
const riders = new Map()
const drivers = new Map()
const trips = new Map()
const ids = new Map()

export const io = function () {
	return socketIo
}

export const initialize = function (server){
	socketIo = sio(server)
	socketIo.on("connection", (socket) => {
		logger.debug(`A user connected with ${socket.id}`)
		
		socket.on('join', function(data) { //Listen to any join event from connected users
			socket.join(data.username); //User joins a unique room/channel that's named after the userId
			console.log("User joined room: " + data.username);
		});
		
		
		socket.on('UPDATE_DRIVER_LOCATION', async(data) => {
			logger.debug(`UPDATE_DRIVER_LOCATION triggered for ${data.username}`)
			drivers.set(data.username, {
				socketId: socket.id,
				...data
			})
			console.log('data', data)
			const { coordinates } =data;
			console.log('coordinates', coordinates)
			
			try {
				const rider = await Rider.findByIdAndUpdate(
					data.user._id ,
					{ location: { coordinates } },
					{new:true}
				).exec();
				console.log('rider',rider)
			} catch (e) {
				console.log('error', e)
			}
			ids.set(socket.socketId,  data)
			socket.join( data.username)
		})
		
		socket.on('UPDATE_RIDER_LOCATION', async(data) => {
			logger.debug(`UPDATE_RIDER_LOCATION triggered for ${data.username}`)
			
			riders.set(data.username, {
				socketId: socket.socketId,
				...data
			})
			const { coordinates } =data;
			try {
				const rider = await Rider.findByIdAndUpdate(
					data.user._id ,
					{ location: { coordinates } },
					{new:true}
				).exec();
				console.log('rider',rider)
			} catch (e) {
				console.log('error', e)
			}
			ids.set(socket.socketId,  data)
		})
		
		socket.on('REQUEST_TRIP', async(data) => {
			const {username} = data.user
			logger.debug(`REQUEST_TRIP triggered for ${username}`)
			
			trips.set(username, {
				socketId: socket.socketId,
				...data
			})
			ids.set(socket.socketId,  data)
			
			socket.join(data.username)
			const nearbyOnlineDrivers = await fetchNearestCops(data.location.coordinates)
			
			console.log('drivers', drivers)
			for (let i=0; i< nearbyOnlineDrivers.length; i++ ) {
				console.log('DISPATCHING REQUEST_TRIP TO DRIVER - ',nearbyOnlineDrivers[i].username)
				socketIo.sockets.in(nearbyOnlineDrivers[i].username).emit('REQUEST_TRIP', data)
			}
		})
	})
	
	return socketIo
}

