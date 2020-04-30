import sio from "socket.io";
import * as logger from "./logger";
import { Rider } from "./resources/rider/rider.model";
import { Driver } from "./resources/driver/driver.model";
import {
	updateDriverLocation,
	updateDriverStatus,
	getDriverById
} from "./resources/driver/driver.crud";
import {
	updateRiderLocation,
	updateRiderStatus,
	updateRiderLocationAndStatus
} from "./resources/rider/rider.crud";
import { Trip } from "./resources/trip/trip.model";

// TODO: Need to add socketio-auth

let socketIo;
const riders = new Map();
const drivers = new Map();
const workingDrivers = new Map();
const ids = new Map();
let nearbyOnlineDrivers = [];
let tripRequestToDriverMap = new Map();
let requestInterval = null;
let requestTimeout = null;

export const io = function() {
	return socketIo;
};

export const initialize = function(server) {
	socketIo = sio(server, {
		path: '/',
		serveClient: false,
		// below are engine.IO options
		pingInterval: 10000,
		pingTimeout: 5000,
		cookie: false
	});

	socketIo.on("connection", async (socket) => {
		const { username, role, id } = socket.handshake.query;
		const connectedUser = { username, role, id };
		
		socketIo.emit('connect', {data:'be received by everyone'})
		logger.debug(
			`USER CONNECTED  ${role} ${username} connected with ${socket.id}`
		);
		logger.debug(
			`Conncted Client ${ids.size}`
		);
		
		console.log('ids',ids)
		
		if (role === "rider") {
				riders.set(username, {
					socketId: socket.id,
					username,
					role,
					id
				});
				const res = await Rider.findByIdAndUpdate(id, {
					status: "standby"
				}, {
					new: true
				}).exec();
				
				ids.set(socket.id, username);
		} else {
				drivers.set(username, {
					socketId: socket.id,
					username,
					role,
					id
				});
				ids.set(socket.id, username);
		}
		
		socket.on('connect_timeout', (timeout) => {
			// ...
		});
		
		socket.on('disconnecting', (reason) => {
			let rooms = Object.keys(socket.rooms).map(room => ids.get(room))
			console.log("Connected room",ids)
			// ...
		});
		
		socket.on("disconnect", async reason => {
			if (reason === 'ping timeout') return
			
			// if (socket.io.connecting.indexOf(socket) === -1){
			// 	return socket.connect()
			// }
		
			if (role === 'rider'){
				try {
					const res = await Rider.findByIdAndUpdate(id, {
						status: "offline",
						connectedSocket: null
					}, {
						new: true
					}).exec();
					riders.delete(username)
					ids.delete(socket.id);
					delete socket.id;
					console.log("connected count", ids)
				} catch (e) {
					console.log("error", e);
				}
			}else{
				try {
					const res = await  Driver.findByIdAndUpdate(id, {
						status: "offline",
						connectedSocket: null
					}, {
						new: true
					}).exec();
					drivers.delete(username)
					ids.delete(socket.id);
					delete socket.id;
				} catch (e) {
					console.log("error", e);
				}
			}
			logger.debug(
				`USER DISCONNECTED   ${role} ${username}`
			);
		
		});

		// socket.emit('',result)
  
		socket.on("join", room => {
			// map socket id to user object
			const { username } = socket.handshake.query;
			// add a room with username
			socket.to(room).emit('USER_JOINED_ROOM', `USER ${username} JOINED "${room}" ROOM`) //User joins a unique room/channel that's named after the userId
			// use username as room name
			logger.debug(`USER ${username} JOINED "${room}" ROOM`);
		});

		socket.on("UPDATE_RIDER_LOCATION", async data => {
			const { username, id } = socket.handshake.query;
			logger.debug(`UPDATE_RIDER_LOCATION - ${username}`);
			const { location } = data;

			logger.debug(`UPDATE_RIDER_LOCATION - ${username}`);
			try {
				await updateRiderLocationAndStatus(id, location);
			} catch (e) {
				console.log("error", e);
			}
		});

		socket.on("UPDATE_DRIVER_LOCATION", async data => {
			const { location } = data;
			const { username, id } = socket.handshake.query;
			logger.debug(`UPDATE_DRIVER_LOCATION - data!!`, data);
			logger.debug(
				`UPDATE_DRIVER_LOCATION - ${username} data add to drivers map`,
				drivers.get(username)
			);

			try {
				await updateDriverLocation(id, location);
			} catch (e) {
				console.log("error", e);
			}
		});

		socket.on("DRIVER_GO_ONLINE", async data => {
			const { username, id, role } = socket.handshake.query;
			workingDrivers.set(username, {
				socketId: socket.id,
				...data,
				username,
				id,
				role
			});

			logger.debug(`DRIVER_GO_ONLINE - ${username}`);
			try {
				const driver = await updateDriverStatus(id, "standby");

				logger.debug(`DRIVER_GO_ONLINE`);
				 // Return to driver
               
               const nearbyOnlineRider = await Rider.find()
                .lean()
                .exec();
				socket.broadcast.emit('DRIVER_GO_ONLINE', driver);
				
			} catch (e) {
				console.log("error", e);
			}
		});

		socket.on("DRIVER_GO_OFFLINE", async data => {
			const { username, id } = socket.handshake.query;
			logger.debug(`DRIVER_GO_OFFLINE triggered for ${username}`);
			try {
				workingDrivers.delete(username);
				const driver = await Driver.findOneAndUpdate(
					{ _id: id },
					{ status: "offline" },
					{ new: true }
				).exec();
    
				// If driver is in the trip room,
                const  trip = await Trip.findOne({ driver: id})
                .exec();
                
                // console.log("trip",trip)
                // broadcast to every one in the room
				if (trip) {
					socketIo.to(trip._id).emit("DRIVER_GO_OFFLINE", username);
					socket.leave(trip._id);
				}
				
				const nearbyOnlineRider = await Rider.find()
				.lean()
				.exec();
				socket.broadcast.emit('DRIVER_GO_OFFLINE', driver);
			} catch (e) {
				console.log("error", e);
			}
		});

		// There are
		socket.on("RIDER_REQUEST_TRIP", async tripRequest => {
			const { username, id } = socket.handshake.query;
			const { riderUsername, riderId } = tripRequest;
			let newTrip, trip;

			logger.debug(`REQUEST_TRIP triggered for ${username}`);

			try {
				nearbyOnlineDrivers = await Driver.find({ status: "standby" })
					.lean()
					.exec();
				newTrip = await Trip.create({
					...tripRequest,
					status: "requesting",
					rider: id
				});
				trip = await Trip.findOne({ _id: newTrip._id })
					.populate("rider")
					.exec();

				console.log("newTrip", newTrip);

				socket.join(trip._id);
				// Return trip id to rider
				socketIo.to(socket.id).emit("TRIP_REQUESTED_BY_RIDER", trip._id);

				for (let driver of nearbyOnlineDrivers) {
					console.log(
						"DISPATCHING REQUEST_TRIP TO DRIVER - ",
						driver.username,
						drivers.get(driver.username).socketId
					);
					tripRequestToDriverMap.set(driver.username, trip._id);

					// RETURNING TRIP info to DRIVER
					socketIo
						.to(drivers.get(driver.username).socketId)
						.emit("TRIP_REQUESTED_BY_RIDER", trip);
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
				// },200000)\
			} catch (e) {
				console.log("there has been an error", e);
			}
		});

		// Driver can accept trip
		socket.on("DRIVER_ACCEPT_TRIP", async data => {
			const { username, id } = socket.handshake.query;
			clearInterval(requestInterval);
			const { driver, rider } = data;
			console.log("data", data);

			// JOIN TRIP_ID CHAT ROOM
			socket.join(data._id);

			try {
				// UPDATE DRIVER STATUS
				const driver = await Driver.findByIdAndUpdate(
					id,
					{ status: "offered" },
					{ new: true }
				).exec();
				// SEND QUOTE TO RIDER
				socketIo
				.to(riders.get(rider.username).socketId)
				.emit("TRIP_ACCEPTED_BY_DRIVER", { ...data, quote: 20, driver });
			} catch (e) {
				console.log("error", e);
			}
		});

		// Rider can confirm trip
		socket.on("CONFIRM_TRIP", async data => {
			const { id } = socket.handshake.query; // Rider
			const { driverId, driverUsername } = data;
			let trip;
		
			try {
				trip = await Trip.findOneAndUpdate(
					{ _id: data._id },
					{ driver: driverId, status: "pickingUp" },
					{ new: true }
				)
					.populate("rider")
					.populate("driver")
					.exec();
				
				// socket.join(rider.username)
				for (let i = 0; i < nearbyOnlineDrivers.length; i++) {
					if (nearbyOnlineDrivers[i].username === driverUsername) {
						console.log(
							"DISPATCHING TRIP_CONFIRMED to dirver - ",
							nearbyOnlineDrivers[i].username
						);
						logger.debug(
							`DISPATCHING TRIP_CONFIRMED to dirver -  ${data.driver.username}`
						);
						socketIo.to(data._id) // tripID
							.emit("TRIP_CONFIRMED_BY_RIDER", data);
					} else {
						console.log(
							"TRIP_REQUEST_CANCELED_BY_RIDER to dirver - ",
							nearbyOnlineDrivers[i].username
						);
						logger.debug(
							`TRIP_REQUEST_CANCELED_BY_RIDER to dirver -  ${data.driver.username}`
						);
						socketIo.to(drivers.get(nearbyOnlineDrivers[i].username))
						.emit("TRIP_REQUEST_CANCELED_BY_RIDER", data);
					}
				}
			} catch (e) {
				console.log("there has been an error", e);
			}
		});

		// Driver can start trip
		socket.on("DRIVER_START_TRIP", async data => {
			const { username, id } = socket.handshake.query; // Driver
			const { driver, rider } = data; // Trip ID?
			let trip;
			socket.join(data._id);
			console.log("DRIVER_START_TRIP ------>");
			console.log("data", data);
			console.log("rider", rider);
			try {
				const driver = await Driver.findOneAndUpdate(
					{ _id: id },
					{ status: "enRoute" }
				).exec();

				const rider = await Rider.findOneAndUpdate(
					{ _id: data.rider._id },
					{ status: "enRoute" }
				).exec();

				await Trip.findOneAndUpdate(
					{ rider: data.rider._id },
					{ status: "enRoute" },
					{ new: true }
				)
					.populate("rider")
					.populate("driver")
					.exec();
				socketIo.sockets
					.to(rider.username)
					.emit("TRIP_STARTED_BY_DRIVER", { ...data });
			} catch (e) {
				console.log("error", e);
			}
		});

		// Driver can end trip
		socket.on("DRIVER_END_TRIP", async data => {
			const { username, id } = socket.handshake.query; // Driver
			const { driver, rider } = data;
			let trip;
			console.log("DRIVER_END_TRIP ------>");
			console.log("data", data);
			console.log("driver", driver);
			console.log("rider", rider);
			// send heartbeat and update driver location
			try {
				const driver = await Driver.findOneAndUpdate(
					{ _id: id },
					{ status: "standby" }
				).exec();

				const rider = await Rider.findOneAndUpdate(
					{ _id: data.rider._id },
					{ status: "standby" }
				).exec();

				await Trip.findOneAndUpdate(
					{ rider: data.rider._id },
					{ status: "ended" },
					{ new: true }
				)
					.populate("rider")
					.populate("driver")
					.exec();
				socketIo.sockets
					.to(rider.username)
					.emit("TRIP_ENDED_BY_DRIVER", { ...data });

				socket.leave(data._id);
			} catch (e) {
				console.log("error", e);
			}
		});

		socket.on("DENY_TRIP_REQUEST", async data => {
		});

		socket.on("RIDER_CANCEL_REQUEST", async data => {
			// clearInterval(requestInterval)
			const { username, id } = socket.handshake.query; // Rider
			logger.debug(
				`RIDER_CANCEL_REQUEST triggered for tripId ${username}`
			);
			try {
				const trip = await Trip.findOneAndRemove({
					_id: data.tripId
				}).exec();

				socketIo.sockets
					.to(username)
					.emit("TRIP_REQUEST_CANCELED_BY_RIDER");
				socket.leave(data.tripId);

				for (let i = 0; i < nearbyOnlineDrivers.length; i++) {
					console.log(
						"DISPATCHING RIDER_REQUEST_CANCELED TO DRIVER - ",
						nearbyOnlineDrivers[i].username
					);
					socketIo.sockets
						.in(nearbyOnlineDrivers[i].username)
						.emit("TRIP_REQUEST_CANCELED_BY_RIDER", data);
					// socketIo.get(nearbyOnlineDrivers[i].username)
				}
			} catch (e) {
				console.log("error", e);
			}
		});

		socket.on("RIDER_CANCEL_TRIP", async data => {
			const { username, id } = socket.handshake.query; // Rider
			logger.debug(
				`RIDER_CANCEL_REQUEST triggered for tripId ${username}`
			);
			try {
				const trip = await Trip.findOneAndUpdate(
					{ _id: data.tripId },
					{ status: "cancelled" }
				).exec();

				const driver = await Driver.findOneAndUpdate(
					{ _id: data.driver._id },
					{ status: "standby" }
				).exec();

				socketIo.sockets.to(username).emit("TRIP_CANCELED_BY_RIDER");

				socket.leave(data.tripId);
			} catch (e) {
				console.log("error", e);
			}
			socketIo.to(data.tripId).emit("TRIP_CANCELED_BY_RIDER", data);
		});

		socket.on("DRIVER_CANCEL_TRIP", async data => {
			const { username, id } = socket.handshake.query; // Driver
			logger.debug(`DRIVER_CANCEL_TRIP triggered for tripId ${username}`);
			try {
				const trip = await Trip.findOneAndUpdate(
					{ _id: data.tripId },
					{ status: "cancelled" }
				).exec();

				const driver = await Driver.findOneAndUpdate(
					{ _id: id },
					{ status: "standby" }
				).exec();

				socketIo.sockets.to(username).emit("TRIP_CANCELED_BY_DRIVER");

				socket.leave(data.tripId);
			} catch (e) {
				console.log("error", e);
			}
			socketIo.to(data.tripId).emit("TRIP_CANCELED_BY_DRIVER", data);
		});
	});

	return socketIo;
};
