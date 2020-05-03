// RIDER
import API from '../utils/axiosAuth'
import * as helper from '../utils/helpers'
import {
	FIND_DRIVERS_NEARBY_STARTED,
	FIND_DRIVERS_NEARBY_SUCCESS,
	FIND_DRIVERS_NEARBY_FAILURE,
	FIND_DRIVER_BY_ID_STARTED,
	FIND_DRIVER_BY_ID_SUCCESS,
	FIND_DRIVER_BY_ID_FAILURE,
	SUBMIT_DRIVER_REVIEW_STARTED,
	SUBMIT_DRIVER_REVIEW_SUCCESS,
	SUBMIT_DRIVER_REVIEW_FAILURE,
	CANCEL_TRIP_REQUEST,
} from './actionTypes'
// Find drivers nearby
export const submitDriverReview = (review, data) => dispatch => {
	dispatch({ type: SUBMIT_DRIVER_REVIEW_STARTED })

	const { driverId, riderId, tripId } = data
	const requestPayload = {
		driverId,
		tripId,
		riderId,
		review: review.details,
		rating: parseInt(review.rating),
	}

	return API()
		.post(`/api/rider/${driverId}/review-trip/${tripId}`, requestPayload)
		.then(res => {
			dispatch({ type: SUBMIT_DRIVER_REVIEW_SUCCESS, payload: res.data })
		})
		.catch(err => {
			dispatch({
				type: SUBMIT_DRIVER_REVIEW_FAILURE,
				payload: err.message,
			})
		})
}

// Find drivers nearby
export const findDriversNearby = location => dispatch => {
	dispatch({ type: FIND_DRIVERS_NEARBY_STARTED })
	return API()
		.get('/api/rider/drivers')
		.then(res => {
			dispatch({ type: FIND_DRIVERS_NEARBY_SUCCESS, payload: res.data })
			console.log('findDriversNearby', res.data)
		})
		.catch(err => {
			dispatch({
				type: FIND_DRIVERS_NEARBY_FAILURE,
				payload: err.message,
			})
		})
}

// Find drivers nearby
export const getDriversById = driverId => dispatch => {
	dispatch({ type: FIND_DRIVER_BY_ID_STARTED })
	// console.log('driverId,', driverId)
	return API()
		.get(`/api/driver/${driverId}`)
		.then(res => {
			dispatch({ type: FIND_DRIVER_BY_ID_SUCCESS, payload: res.data })
		})
		.catch(err => {
			dispatch({ type: FIND_DRIVER_BY_ID_FAILURE, payload: err.message })
		})
}

export const cancelTripRequest = () => dispatch => {
	// console.log('cancelTripRequest')
	dispatch({ type: CANCEL_TRIP_REQUEST })
}

export const confirmTrip = (socket, data) => dispatch => {
	// console.log('confirmTrip')
	socket.emit('CONFIRM_TRIP', data)
	socket.on('TRIP_CONFIRMED_BY_RIDER', () => {
		console.log('!!!!!TRIP_CONFIRMED_BY_RIDER')
	})
}

export const riderCancelTrip = (socket, data) => dispatch => {
	// console.log('riderCancelTrip')
	socket.emit('RIDER_CANCEL_TRIP', data)
}

export const riderCancelRequest = (socket, data) => dispatch => {
	// console.log('riderCancelRequest')
	socket.emit('RIDER_CANCEL_REQUEST', data)

	socket.on('RIDER_REQUEST_CANCELED', () => {
		console.log('RIDER_REQUEST_CANCELED! \n')
	})
}

export const riderRequestTrip = (socket, data) => dispatch => {
	console.log("data",data)
	socket.emit('RIDER_REQUEST_TRIP', data)
}

export const updateThisRiderLocation = (socket, data) => dispatch => {
	// console.log('updateRiderLocation...', data)
	socket.emit('UPDATE_RIDER_LOCATION', data)
}

export const userLoggedOut = (socket) => dispatch => {
	// console.log('updateRiderLocation...', data)
	socket.emit('USER_LOGGED_OUT')
}
