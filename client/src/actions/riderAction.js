// RIDER
import API from "../utils/axiosAuth";
import * as helper from '../utils/helpers'
import {
	RIDER_SIGNUP_STARTED,
	RIDER_SIGNUP_SUCCESS,
	RIDER_SIGNUP_FAILURE,
	RIDER_LOGIN_STARTED,
	RIDER_LOGIN_SUCCESS,
	RIDER_LOGIN_FAILURE,
	FIND_DRIVERS_NEARBY_STARTED,
	FIND_DRIVERS_NEARBY_SUCCESS,
	FIND_DRIVERS_NEARBY_FAILURE,
	FIND_DRIVER_BY_ID_STARTED,
	FIND_DRIVER_BY_ID_SUCCESS,
	FIND_DRIVER_BY_ID_FAILURE,
	UPDATE_RIDER_PROFILE_STARTED,
	UPDATE_RIDER_PROFILE_SUCCESS,
	UPDATE_RIDER_PROFILE_FAILURE,
	SUBMIT_DRIVER_REVIEW_STARTED,
	SUBMIT_DRIVER_REVIEW_SUCCESS,
	SUBMIT_DRIVER_REVIEW_FAILURE,
	CANCEL_TRIP_REQUEST,
} from "./actionTypes";
// import {setLocalStore, getLocalStore} from "../utils/helpers";
// Find drivers nearby
export const submitDriverReview = (review, data) => dispatch => {
	dispatch({type: SUBMIT_DRIVER_REVIEW_STARTED})
	
	const  {driverId, riderId, tripId} = data
	const requestPayload = {
		driverId,
		tripId,
		riderId,
		review:review.details,
		rating:parseInt(review.rating)
	}
	
	return (
		API().post(`/api/rider/${driverId}/review-trip/${tripId}`, requestPayload)
		.then(res =>{
			dispatch({type: SUBMIT_DRIVER_REVIEW_SUCCESS, payload: res.data})
		})
		.catch(err =>{
			dispatch({type: SUBMIT_DRIVER_REVIEW_FAILURE, payload: err.message})
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
	console.log('login_rider')
	return (
		API().post('/signin', {...rider, role:'rider'})
		.then(res =>{
			const {token} = res.data
			// setLocalStore('token', token)
			// setLocalStore('user', {username: user.username, userId: user._id, role:'rider'})
			//
			// localStorage.setItem('user', JSON.stringify({username: user.username, userId: user._id, role:'rider'}))
			// localStorage.setItem('token', token)
			helper.setToken(token)
			// console.log('token',localStorage.getItem('token'))
			
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
	
	return (
		API().post(`/api/rider/uploadProfile`, formValue)
		.then(res =>{
			console.log('uploadProfilePhoto res', res)
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

export const cancelTripRequest = () => dispatch => {
	console.log('cancelTripRequest')
	dispatch({type: CANCEL_TRIP_REQUEST})
}

export const confirmTrip = (socket, data) => dispatch => {
	console.log('confirmTrip')
	socket.emit('CONFIRM_TRIP', data)
	
	socket.on('TRIP_CONFIRMED_BY_RIDER', ()=>{
		console.log("!!!!!TRIP_CONFIRMED_BY_RIDER")
	})
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

export const riderRequestTrip = (socket, data) => dispatch =>{
	socket.emit('RIDER_REQUEST_TRIP', data)
}

export const updateThisRiderLocation = (socket, data) => dispatch =>{
	console.log('updateRiderLocation...',data)
	socket.emit('UPDATE_RIDER_LOCATION', data)
}



