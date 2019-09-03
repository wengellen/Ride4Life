// RIDER
import API from "../utils/axiosAuth";
import {
	DRIVER_LOGIN_SUCCESS,
	UPDATE_PROFILE_FAILURE,
	UPDATE_PROFILE_STARTED,
	UPDATE_PROFILE_SUCCESS
} from "./driverAction";
import socket from "../utils/socketConnection";

export const RIDER_SIGNUP_STARTED = 'RIDER_SIGNUP_STARTED'
export const RIDER_SIGNUP_SUCCESS = 'RIDER_SIGNUP_SUCCESS'
export const RIDER_SIGNUP_FAILURE = 'RIDER_SIGNUP_FAILURE'

export const RIDER_LOGIN_STARTED = 'RIDER_LOGIN_STARTED'
export const RIDER_LOGIN_SUCCESS = 'RIDER_LOGIN_SUCCESS'
export const RIDER_LOGIN_FAILURE = 'RIDER_LOGIN_FAILURE'

export const LOGOUT_USER = 'LOGOUT_USER'

export const FIND_DRIVERS_NEARBY_STARTED = 'FIND_DRIVERS_NEARBY_STARTED'
export const FIND_DRIVERS_NEARBY_SUCCESS = 'FIND_DRIVERS_NEARBY_SUCCESS'
export const FIND_DRIVERS_NEARBY_FAILURE = 'FIND_DRIVERS_NEARBY_FAILURE'

export const FIND_DRIVER_BY_ID_STARTED = 'FIND_DRIVER_BY_ID_STARTED'
export const FIND_DRIVER_BY_ID_SUCCESS = 'FIND_DRIVER_BY_ID_SUCCESS'
export const FIND_DRIVER_BY_ID_FAILURE = 'FIND_DRIVER_BY_ID_FAILURE'

export const SEND_TRIP_REQUEST_STARTED = 'SEND_TRIP_REQUEST_STARTED'
export const SEND_TRIP_REQUEST_SUCCESS = 'SEND_TRIP_REQUEST_SUCCESS'
export const SEND_TRIP_REQUEST_FAILURE = 'SEND_TRIP_REQUEST_FAILURE'

export const UPDATE_LOCATION_STARTED = 'UPDATE_LOCATION_STARTED'
export const UPDATE_LOCATION_SUCCESS = 'UPDATE_LOCATION_SUCCESS'
export const UPDATE_LOCATION_FAILURE = 'UPDATE_LOCATION_FAILURE'

export const UPDATE_RIDER_PROFILE_STARTED = 'UPDATE_RIDER_PROFILE_STARTED'
export const UPDATE_RIDER_PROFILE_SUCCESS = 'UPDATE_RIDER_PROFILE_SUCCESS'
export const UPDATE_RIDER_PROFILE_FAILURE = 'UPDATE_RIDER_PROFILE_FAILURE'

export const SUBMIT_REVIEW_STARTED = 'SUBMIT_REVIEW_STARTED'
export const SUBMIT_REVIEW_SUCCESS = 'SUBMIT_REVIEW_SUCCESS'
export const SUBMIT_REVIEW_FAILURE = 'SUBMIT_REVIEW_FAILURE'

export const CANCEL_TRIP_REQUEST = 'CANCEL_TRIP_REQUEST'

export const CONFIRM_TRIP_REQUEST = 'CONFIRM_TRIP_REQUEST'


// Find drivers nearby
export const submitDriverReview = (review, driver_id) => dispatch => {
	dispatch({type: SUBMIT_REVIEW_STARTED})
	const currentUser = JSON.parse(localStorage.getItem('loggedInUser'))
	// console.log("currentUser",currentUser)
	const requestPayload = {
				driver_id,
				user_id: currentUser.rider_id,
				review:review.details,
				rating:review.rating
			}
	// console.log("requestPayload",requestPayload)
	
	return (
		API().post('/api/drivers/reviews', requestPayload)
		.then(res =>{
			dispatch({type: SUBMIT_REVIEW_SUCCESS, payload: res.data})
		})
		.catch(err =>{
			dispatch({type: SUBMIT_REVIEW_FAILURE, payload: err.message})
		})
	)
}

// Find drivers nearby
export const findDriversNearby = (location) => dispatch => {
	console.log('findDriversNearby location',location)
	dispatch({type: FIND_DRIVERS_NEARBY_STARTED})
	return (
		API().get('/api/rider/drivers')
		.then(res =>{
			dispatch({type: FIND_DRIVERS_NEARBY_SUCCESS, payload: res.data})
			console.log('findDriversNearby', res.data)
		})
		.catch(err =>{
			dispatch({type: FIND_DRIVERS_NEARBY_FAILURE, payload: err.message})
		})
	)
}



// Find drivers nearby
export const getDriversById = (driverId) => dispatch => {
	dispatch({type: FIND_DRIVER_BY_ID_STARTED})
	console.log('driverId,',driverId)
	return (
		API().get(`/api/driver/${driverId}`)
		.then(res =>{
			dispatch({type: FIND_DRIVER_BY_ID_SUCCESS, payload: res.data})
		})
		.catch(err =>{
			dispatch({type: FIND_DRIVER_BY_ID_FAILURE, payload: err.message})
		})
	)
}


// LOGIN / SIGN UP
export const signup_rider = (rider) => dispatch => {
	dispatch({type: RIDER_SIGNUP_STARTED})
  	return (
		API().post('/signup', {...rider, role:'rider'})
		.then(res =>{
			dispatch({type: RIDER_SIGNUP_SUCCESS, payload: res.data})
			return res.data
		})
		.catch(error => {
			console.log(error.response)
			console.log( error.response.data.error)
			dispatch({type: RIDER_SIGNUP_FAILURE, payload: error.response.data.error})
			return error.response
		})
	)
}

export const login_rider = (rider) => dispatch => {
	dispatch({type: RIDER_LOGIN_STARTED})
	return (
		API().post('/signin', {...rider, role:'rider'})
		.then(res =>{
			localStorage.setItem('token', res.data.token)
			localStorage.setItem('user', JSON.stringify(res.data.user))
			console.log('res.data',res.data)
			// localStorage.setItem('loggedInUser', JSON.stringify({...res.data}))
			dispatch({type: RIDER_LOGIN_SUCCESS, payload: res.data})
			return res.data
		})
		.catch(err =>{
			if (err.response && err.response.status === 401) {
				dispatch({type: RIDER_LOGIN_FAILURE, payload: err.response.data.message})
			}
			
			// dispatch({type: RIDER_LOGIN_FAILURE, payload: err.response})
			return err.response
		})
	)
}

export const uploadRiderProfile = (formValue) => dispatch =>{
	dispatch({type:UPDATE_RIDER_PROFILE_STARTED})
	console.log('uploadProfilePhoto formData', formValue)
	
	return (
		API().post(`/api/rider/uploadProfile`, formValue)
		.then(res =>{
			console.log('uploadProfilePhoto res', res)
			// localStorage.setItem('user', JSON.stringify(res.data.user))
			dispatch({type: UPDATE_RIDER_PROFILE_SUCCESS, payload: res.data})
			return res.data
		})
		.catch(err =>{
			console.log('err', err)
			if (err.response && err.response.status === 401) {
				dispatch({type: UPDATE_RIDER_PROFILE_FAILURE, payload: err.response.data})
			}
			
			return  err.response.data
		})
	)
}

export const logoutUser = () => dispatch => {
	localStorage.removeItem('token')
	localStorage.removeItem('user')
	socket.disconnect()
	dispatch({type: LOGOUT_USER})
}

export const cancelTripRequest = () => dispatch => {
	console.log('cancelTripRequest')
	dispatch({type: CANCEL_TRIP_REQUEST})
}

export const confirmTrip = (socket, data) => dispatch => {
	console.log('confirmTrip')
	socket.emit('CONFIRM_TRIP', data)
}

export const riderCancelTrip = (socket, data) => dispatch => {
	console.log('riderCancelTrip')
	socket.emit('RIDER_CANCEL_TRIP', data)
}


export const riderCancelRequest = (socket, data) => dispatch => {
	console.log('riderCancelRequest')
	socket.emit('RIDER_CANCEL_REQUEST', data)
	
	socket.on('RIDER_REQUEST_CANCELED', () => {
		console.log(
			'RIDER_REQUEST_CANCELED! \n'
		)
	})
}

export const requestTrip = (socket, data) => dispatch =>{
	socket.emit('REQUEST_TRIP', data)
}

export const updateThisRiderLocation = (socket, data) => dispatch =>{
	console.log('updateRiderLocation...',data)
	socket.emit('UPDATE_RIDER_LOCATION', data)
}



