import { Driver } from "./driver.model";
import MapBoxAPIClient from '../../utils/MapboxAPIClient'
const mapboxClient = new MapBoxAPIClient()

const getDriverById = id => {
	return Driver.findById(id).exec();
};

const getAllDrivers = () => {
	return Driver.find({}).exec();
};

const createDriver = userDetails => {
	return Driver.create(userDetails);
};

const removeDriverById = id => {
	return Driver.findByIdAndDelete(id).exec();
};

const updateDriverById = (id, update) => {
	return Driver.findByIdAndUpdate(id, update, {
		new: true,
		useFindAndModify: false
	}).exec();
};

export const updateDriverLocation = (id, location) => {
	return updateDriverById(id, { location });
};

export const updateDriverStatus = (id, status) => {
	return updateDriverById(id, { status: status });
};

export const getNearbyOnlineDrivers = async (
	coordinates = ["-122.03836736354654", "37.96039811452054"]
) => {
	// await Driver.createIndex().catch(e => console.error(e))
	console.log("coordinates", coordinates);
	try {
		const drivers = await Driver.find({status:"standby"}).lean().exec()
		// const drivers = await Driver.find({
		//     location: {
		//         $near: {
		//             $geometry: {
		//                 type: "Point",
		//                 coordinates: coordinates
		//             },
		//             $maxDistance: 2000
		//         }
		//     }}).lean().exec()
		// await Driver.createIndex().catch(e => console.error(e))
		// 	.lean()
		// 	.exec();
		console.log('drivers',drivers)
		return drivers;
	} catch (e) {
		console.log(e);
	}
};

export const getDistanceAndDuration = async (
	coord1 = [],
	coord2 = [],
) => {
	// await Driver.createIndex().catch(e => console.error(e))
	// console.log("coord1", coord1);
	// console.log("coord2", coord2);
	try {
		const obj =  mapboxClient.getDistanceAndDuration(coord1, coord2)
		// const drivers = await Driver.find({status:"standby"}).lean().exec()
		// const drivers = await Driver.find({
		//     location: {
		//         $near: {
		//             $geometry: {
		//                 type: "Point",
		//                 coordinates: coordinates
		//             },
		//             $maxDistance: 2000
		//         }
		//     }}).lean().exec()
		// await Driver.createIndex().catch(e => console.error(e))
		// 	.lean()
		// 	.exec();
		// console.log('obj',obj)
		return obj;
	} catch (e) {
		console.log(e);
	}
};

export const crud = {
	getDriverById,
	getAllDrivers,
	createDriver,
	removeDriverById,
	updateDriverById,
	updateDriverLocation,
	updateDriverStatus,
	getNearbyOnlineDrivers,
	getDistanceAndDuration
};
