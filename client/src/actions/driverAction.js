// DRIVER
import API from '../utils/axiosAuth'
import {
	SUBMIT_RIDER_REVIEW_STARTED,
	SUBMIT_RIDER_REVIEW_SUCCESS,
	SUBMIT_RIDER_REVIEW_FAILURE,
} from './actionTypes'

export const driverCancelTrip = (socket, data) => dispatch => {
	console.log('driverCancelTrip')
	socket.emit('DRIVER_CANCEL_TRIP', data)
}

export const acceptTrip = (socket, data) => dispatch => {
	console.log('acceptTrip')
	socket.emit('DRIVER_ACCEPT_TRIP', data)
}

export const driverGoOnline = (socket, data) => dispatch => {
	console.log('driverGoOnline')
	socket.emit('DRIVER_GO_ONLINE', data)
}

export const driverGoOffline = (socket, data) => dispatch => {
	console.log('driverGoOffline')
	socket.emit('DRIVER_GO_OFFLINE', data)
}

export const driverStartTrip = (socket, data) => dispatch => {
	console.log('trip started')
	socket.emit('DRIVER_START_TRIP', data)

	dispatch({
		type: 'START_TRIP',
	})
}

export const driverEndTrip = (socket, data) => dispatch => {
	console.log('trip ended')
	socket.emit('DRIVER_END_TRIP', data)
}

export const updateDriverLocation = (socket, data) => dispatch => {
	console.log('updateDriverLocation')
	socket.emit('UPDATE_DRIVER_LOCATION', data)
}

export const submitRiderReview = (review, data) => dispatch => {
	dispatch({ type: SUBMIT_RIDER_REVIEW_STARTED })
	const { driverId, riderId, tripId } = data
	const requestPayload = {
		driverId,
		tripId,
		riderId,
		review: review.details,
		rating: parseInt(review.rating),
	}

	return API()
		.post(`/api/driver/${driverId}/review-trip/${tripId}`, requestPayload)
		.then(res => {
			dispatch({ type: SUBMIT_RIDER_REVIEW_SUCCESS, payload: res.data })
			return res.data
		})
		.catch(err => {
			dispatch({
				type: SUBMIT_RIDER_REVIEW_FAILURE,
				payload: err.message,
			})
			return err.response
		})
}
