
// DRIVER
import API  from "../utils/axiosAuth";
import {CONFIRM_TRIP_REQUEST} from "./riderAction";
import socket from "../utils/socketConnection";

export const DRIVER_SIGNUP_STARTED = 'DRIVER_SIGNUP_STARTED'
export const DRIVER_SIGNUP_SUCCESS = 'DRIVER_SIGNUP_SUCCESS'
export const DRIVER_SIGNUP_FAILURE = 'DRIVER_SIGNUP_FAILURE'

export const DRIVER_LOGIN_STARTED = 'DRIVER_LOGIN_STARTED'
export const DRIVER_LOGIN_SUCCESS = 'DRIVER_LOGIN_SUCCESS'
export const DRIVER_LOGIN_FAILURE = 'DRIVER_LOGIN_FAILURE'

export const UPDATE_LOCATION_STARTED = 'UPDATE_LOCATION_STARTED'
export const UPDATE_LOCATION_SUCCESS = 'UPDATE_LOCATION_SUCCESS'
export const UPDATE_LOCATION_FAILURE = 'UPDATE_LOCATION_FAILURE'

export const UPDATE_PROFILE_STARTED = 'UPDATE_PROFILE_STARTED'
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS'
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE'

export const UPLOAD_PROFILE_STARTED = 'UPLOAD_PROFILE_STARTED'
export const UPLOAD_PROFILE_SUCCESS = 'UPLOAD_PROFILE_SUCCESS'
export const UPLOAD_PROFILE_FAILURE = 'UPLOAD_PROFILE_FAILURE'

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

export const updateDriverLocation = (socket, data) => dispatch => {
	console.log('updateDriverLocation')
	socket.emit('UPDATE_DRIVER_LOCATION', data)
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
	   		console.log('signin usccess', res)
			localStorage.setItem('token', res.data.token)
			localStorage.setItem('user', JSON.stringify(res.data.user))
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
	console.log('uploadProfilePhoto formData', formValue)
	console.log('uploadProfilePhoto token', localStorage.getItem('token'))
	return (
		API().post(`/api/driver/uploadProfile`, formValue)
		// API.post(`/image-upload`, formData)
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


