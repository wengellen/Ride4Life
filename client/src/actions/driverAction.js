
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
	
} from "./actionTypes";

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


