import sio from "socket.io";
import * as logger from "./utils/logger";
import { Rider } from "./resources/rider/rider.model";
import { Driver } from "./resources/driver/driver.model";
import {
	updateDriverLocation,
	updateDriverStatus,
	getDriverById,
	getNearbyOnlineDrivers,
	getDistanceAndDuration
} from "./resources/driver/driver.crud";
import {
	updateRiderLocation,
	updateRiderStatus,
	updateRiderLocationAndStatus
} from "./resources/rider/rider.crud";
import MapBoxAPIClient from "./utils/MapboxAPIClient";
import { Trip } from "./resources/trip/trip.model";
const mapboxClient = new MapBoxAPIClient();
// TODO: Need to add socketio-auth

let socketIo;
const riders = new Map();
const drivers = new Map();
const workingDrivers = new Map();
const ids = new Map();
let nearbyOnlineDrivers = [];
let tripRequestToDriverMap = new Map();
let requestInterval = null;
let updateTripInterval = null;
let requestTimeout = null;

export const io = function() {
	return socketIo;
};

export const initialize = function(server) {
	socketIo = sio(server, {});

	socketIo.on("connection", async socket => {
		const { username, role, id } = socket.handshake.query;
		const connectedUser = { username, role, id };

		socketIo.emit("connect", { data: "be received by everyone" });
		logger.debug(
			`USER CONNECTED  ${role} ${username} connected with ${socket.id}`
		);

		const entries = [...ids.entries()];
		// If this user name is already in ids, remove it and replace with the new one
		for (let [socketId, v] of entries) {
			if (v === username) {
				// Tell old client to disconnect
				socketIo.sockets
					.to(socketId)
					.emit("disconnect", "MULTIPLE_LOGIN");
				ids.delete(socketId); // remove from map
			}
		}
		ids.set(socket.id, username);

		if (role === "rider") {
			riders.set(username, {
				socketId: socket.id,
				username,
				role,
				id
			});

			const res = await Rider.findByIdAndUpdate(
				id,
				{
					status: "standby"
				},
				{
					new: true
				}
			).exec();

			ids.set(socket.id, username);
		} else {
			drivers.set(username, {
				socketId: socket.id,
				username,
				role,
				id
			});

			// If it's not in ids,
		}
		console.log("Connected Sockets:", ids);
		console.log("Connected Drivers:", drivers);
		console.log("Connected Riders:", riders);

		socket.on("connect_timeout", timeout => {
			// ...
		});

		socket.on("disconnecting", async reason => {
			try {
				const values = [...ids.values()].includes();
				if (role === "rider") {
					const res = await Rider.findByIdAndUpdate(
						id,
						{
							status: "offline"
						},
						{
							new: true
						}
					).exec();
				} else {
					const res = await Driver.findByIdAndUpdate(
						id,
						{
							status: "offline"
						},
						{
							new: true
						}
					);
				}
			} catch (e) {
				console.log("error", e);
			}
		});

		socket.on("disconnect", async reason => {
			if (reason === "ping timeout") return;

			console.log("reason");

			if (role === "rider") {
				riders.delete(username);
			} else {
				drivers.delete(username);
			}
			ids.delete(socket.id);
			logger.debug(
				`!!!!!USER DISCONNECTED   ${role} ${username} - ${socket.id}`
			);
		});

		// socket.emit('',result)
		socket.on("join", room => {
			// map socket id to user object
			const { username } = socket.handshake.query;
			// add a room with username
			socket
				.to(room)
				.emit(
					"USER_JOINED_ROOM",
					`USER ${username} JOINED "${room}" ROOM`
				); //User joins a unique room/channel that's named after the userId
			// use username as room name
			logger.debug(`USER ${username} JOINED "${room}" ROOM`);
		});

		socket.on("UPDATE_RIDER_LOCATION", async (data, callback) => {
			const { username, id } = socket.handshake.query;
			const { location } = data;

			try {
				await updateRiderLocationAndStatus(id, location);
			} catch (e) {
				console.log("error", e);
			}
		});

		socket.on("UPDATE_DRIVER_LOCATION", async data => {
			const { location } = data;
			const { username, id } = socket.handshake.query;
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
				// socket.broadcast.emit("DRIVER_GO_ONLINE", driver);

				console.log("ids", ids);
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
				const trip = await Trip.findOne({ driver: id }).exec();

				// broadcast to every one in the room
				if (trip) {
					socketIo.to(trip._id).emit("DRIVER_GO_OFFLINE", username);
					socket.leave(trip._id);
				}

				const nearbyOnlineRider = await Rider.find()
					.lean()
					.exec();
				socket.broadcast.emit("DRIVER_GO_OFFLINE", driver);
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
				socket.nearbyOnlineDrivers = await Driver.find({
					status: "standby"
				})
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

				// console.log("newTrip", newTrip);
				// console.log("nearbyOnlineDrivers", socket.nearbyOnlineDrivers);

				// Rider join trip id chat room
				socket.join(trip._id);
				// Return trip id to rider
				socketIo
					.to(socket.id)
					.emit("TRIP_REQUESTED_BY_RIDER", trip._id);

				requestInterval = setInterval(async () => {
					nearbyOnlineDrivers = await Driver.find({
						status: "standby"
					})
						.lean()
						.exec();
					logger.debug("nearbyOnlineDrivers", nearbyOnlineDrivers);
					for (let driver of nearbyOnlineDrivers) {
						console.log(
							"DISPATCHING TRIP_REQUESTED_BY_RIDER TO DRIVER - ",
							driver.username
						);
						socketIo
							.to(drivers.get(driver.username).socketId)
							.emit("TRIP_REQUESTED_BY_RIDER", trip);
						// }
					}
				}, 2000);

				requestTimeout = setTimeout(() => {
					clearInterval(requestInterval);
					console.log("clearInterval - ");
				}, 200000);
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

			// Driver JOIN TRIP_ID CHAT ROOM
			socket.join(data._id);

			try {
				// UPDATE DRIVER STATUS
				const driver = await Driver.findByIdAndUpdate(
					id,
					{ status: "offered" },
					{ new: true }
				).exec();

				socketIo
					.to(riders.get(rider.username).socketId)
					.emit("TRIP_ACCEPTED_BY_DRIVER", {
						...data,
						driver
					});
			} catch (e) {
				console.log("error", e);
			}
		});

		const getUpdatedTripInfo = async ({ tripId, driverId }) => {
			// const trip = await Trip.findOne({ _id: tripId })
			// .populate("rider")
			// .populate("driver")
			// .exec();
			// .exec();
			const newTrip = await Trip.findOneAndUpdate(
				{ _id: tripId },
				{ driver: driverId, status: "pickingUp" },
				{ new: true }
			)
				.populate("rider")
				.populate("driver")
				.exec();

			const trip = newTrip.toJSON();
			console.log("trip", trip);

			// Get distance and duration between driver and destination
			const {
				distance: distanceToDestination,
				duration: durationToDestination
			} = await mapboxClient.getDistanceAndDuration(
				trip.endLocation.coordinates,
				trip.driver.location
			);

			//Get distance and duration between driver and rider
			const {
				distance: distanceToRider,
				duration: durationToRider
			} = await mapboxClient.getDistanceAndDuration(
				trip.rider.location,
				trip.driver.location
			);

			const updatedTrip = {
				...trip,
				distanceToRider,
				durationToRider,
				distanceToDestination,
				durationToDestination,
			};
			logger.debug(
				`getDistanceAndDuration- distanceToDestination: ${distanceToDestination}, durationToDestination:${durationToDestination}`
			);
			logger.debug(
				`getDistanceAndDuration- distanceToRider: ${distanceToRider}, Duration:${durationToRider}`
			);

			return updatedTrip;
		};

		// Rider can confirm trip
		socket.on("CONFIRM_TRIP", async data => {
			const { id } = socket.handshake.query; // Rider
			const { driverUsername, driverId, acceptedDrivers, _id } = data; // Accepted Driver
			let trip;
		
			try {
				const updatedTrip = await getUpdatedTripInfo({
					tripId: _id,
					driverId
				});
				// Drivers that has previously offered
				for (let i = 0; i < nearbyOnlineDrivers.length; i++) {
					const driver = nearbyOnlineDrivers[i];
					if (driver.username === driverUsername) {
						console.log(
							"DISPATCHING TRIP_CONFIRMED to dirver - ",
							driver.username
						);
						socketIo
							.to(drivers.get(driverUsername).socketId) // tripID
							.emit("TRIP_CONFIRMED_BY_RIDER", updatedTrip);

						await updateDriverStatus(driver._id, "offered");

						updateTripInterval = setInterval(async () => {
							const updatedTrip = await getUpdatedTripInfo({
								tripId: _id,
								driverId
							});
							socketIo
								.to(drivers.get(driverUsername).socketId)
								.emit("TRIP_UPDATE", updatedTrip);
						}, 4000);
					} else {
						// Cancel trip request for denied drivers
						console.log(
							"TRIP_REQUEST_CANCELED_BY_RIDER to dirver - ",
							driver.username
						);
						socketIo
							.to(drivers.get(driver.username).socketId)
							.emit("TRIP_REQUEST_CANCELED_BY_RIDER", data);

						await updateDriverStatus(driver._id, "standby");
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
			console.log("DRIVER_START_TRIP ------>");
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
					.to(riders.get(rider.username).socketId)
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

			clearInterval(updateTripInterval);
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

		socket.on("DENY_TRIP_REQUEST", async data => {});

		socket.on("RIDER_CANCEL_REQUEST", async data => {
			clearInterval(requestInterval);
			const { username, id } = socket.handshake.query; // Rider
			logger.debug(
				`RIDER_CANCEL_REQUEST triggered for tripId ${username}`
			);
			try {
				const trip = await Trip.findOneAndRemove({
					_id: data.tripId
				}).exec();

				socketIo.to(data.tripId).emit("TRIP_REQUEST_CANCELED_BY_RIDER");

				socket.leave(data.tripId);
			} catch (e) {
				console.log("error", e);
			}
		});

		socket.on("RIDER_CANCEL_TRIP", async data => {
			const { username, id } = socket.handshake.query; // Rider
			const { requestDetails, tripId } = data; // Rider
			consolelog("data")
			logger.debug(
				`RIDER_CANCEL_REQUEST triggered for tripId ${username}`
			);
			try {
				const trip = await Trip.findOneAndUpdate(
					{ _id: tripId},
					{ status: "cancelled" }
				).exec();

				const driver = await Driver.findOneAndUpdate(
					{ _id: requestDetails.driver._id },
					{ status: "standby" }
				).exec();

				socketIo.sockets.to(drivers.get(requestDetails.driver.username).socketId).emit("TRIP_CANCELED_BY_RIDER");

				socket.leave(data.tripId);
			} catch (e) {
				console.log("error", e);
			}
		});

		socket.on("DRIVER_CANCEL_TRIP", async data => {
			const { username, id } = socket.handshake.query; // Driver
			const { requestDetails, tripId } = data; // Rider
			logger.debug(`DRIVER_CANCEL_TRIP triggered for tripId ${username}`);
			try {
				const trip = await Trip.findOneAndUpdate(
					{ _id:tripId },
					{ status: "cancelled" }
				).exec();

				const driver = await Driver.findOneAndUpdate(
					{ _id: id },
					{ status: "standby" }
				).exec();
				socketIo.sockets.to(riders.get(requestDetails.rider.username).socketId).emit("TRIP_CANCELED_BY_RIDER");
				// socketIo.sockets.to(username).emit("TRIP_CANCELED_BY_DRIVER");

				socket.leave(data.tripId);
			} catch (e) {
				console.log("error", e);
			}
			socketIo.to(data.tripId).emit("TRIP_CANCELED_BY_DRIVER", data);
		});
	});

	return socketIo;
};
