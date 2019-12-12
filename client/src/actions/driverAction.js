
// DRIVER
import API  from "../utils/axiosAuth";
import {
	DRIVER_SIGNUP_STARTED,
	DRIVER_SIGNUP_SUCCESS,
	DRIVER_SIGNUP_FAILURE,
	DRIVER_LOGIN_STARTED,
	DRIVER_LOGIN_SUCCESS,
	DRIVER_LOGIN_FAILURE,
	UPDATE_PROFILE_STARTED,
	UPDATE_PROFILE_SUCCESS,
	UPDATE_PROFILE_FAILURE,
	SUBMIT_RIDER_REVIEW_STARTED,
	SUBMIT_RIDER_REVIEW_SUCCESS,
	SUBMIT_RIDER_REVIEW_FAILURE,
} from "./actionTypes";
import {setLocalStore} from "../utils/helpers";


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
		type:"START_TRIP"
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
	dispatch({type: SUBMIT_RIDER_REVIEW_STARTED})
	const  {driverId, riderId, tripId} = data
	const requestPayload = {
		driverId,
		tripId,
		riderId,
		review:review.details,
		rating:parseInt(review.rating)
	}
	
	return (
		API().post(`/api/driver/${driverId}/review-trip/${tripId}`, requestPayload)
		.then(res =>{
			dispatch({type: SUBMIT_RIDER_REVIEW_SUCCESS, payload: res.data})
			return res.data
		})
		.catch(err =>{
			dispatch({type: SUBMIT_RIDER_REVIEW_FAILURE, payload: err.message})
			return err.response
		})
	)
}

// Update Profile
export const updateProfile = (user) => dispatch => {
	dispatch({type: UPDATE_PROFILE_STARTED})
	return (
		API().put(`/api/users/${user.id}`)
		.then(res =>{
			dispatch({type: UPDATE_PROFILE_SUCCESS, payload: res.data})
		})
		.catch(err => err.message)
	)
}

// DRIVER
export const signup_driver= (driver) => dispatch =>{
	dispatch({type:DRIVER_SIGNUP_STARTED})
	return (
		API().post('/signup', {...driver, role:'driver'})
		.then(res =>{
			dispatch({type: DRIVER_SIGNUP_SUCCESS, payload: res.data})
			console.log('res.data',res.data)
			return res.data
		})
		.catch(err => {
			console.log(err)
			if(err.response){
				dispatch({type: DRIVER_SIGNUP_FAILURE, payload: err.response.data})
			}
			return err.response
		})
	)
}

export const login_driver= (driver) => dispatch =>{
	dispatch({type:DRIVER_LOGIN_STARTED})
	return (
		API().post('/signin', {...driver, role:'driver'})
	   .then(res =>{
	   		console.log('signin susccess', res)
	   		setLocalStore('token', res.data.token)
	   		setLocalStore('user', res.data.user)
			// localStorage.setItem('token', res.data.token)
		    // socketInit(res.data.token)
		
		   // localStorage.setItem('user', JSON.stringify(res.data.user))
		   dispatch({type: DRIVER_LOGIN_SUCCESS, payload: res.data})
		   return res.data
		})
		.catch(err =>{
			console.log('err', err)
			if (err.response && err.response.status === 401) {
				dispatch({type: DRIVER_LOGIN_FAILURE, payload: err.response.data})
			}
			
			return  err.response.data
		})
	)
}

export const uploadProfile = (formValue) => dispatch =>{
	dispatch({type:UPDATE_PROFILE_STARTED})
	return (
		API().post(`/api/driver/uploadProfile`, formValue)
		.then(res =>{
			console.log('uploadProfile', res)
			dispatch({type: UPDATE_PROFILE_SUCCESS, payload: res.data})
			return res.data
		})
		.catch(err =>{
			console.log('err', err)
			if (err.response && err.response.status === 401) {
				dispatch({type: UPDATE_PROFILE_FAILURE, payload: err.response.data})
			}
			
			return  err.response.data
		})
	)
}


