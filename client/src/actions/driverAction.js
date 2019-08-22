
// DRIVER
import {API} from "../utils/axiosAuth";
import {CONFIRM_TRIP_REQUEST} from "./riderAction";

export const DRIVER_SIGNUP_STARTED = 'DRIVER_SIGNUP_STARTED'
export const DRIVER_SIGNUP_SUCCESS = 'DRIVER_SIGNUP_SUCCESS'
export const DRIVER_SIGNUP_FAILURE = 'DRIVER_SIGNUP_FAILURE'

export const DRIVER_LOGIN_STARTED = 'DRIVER_LOGIN_STARTED'
export const DRIVER_LOGIN_SUCCESS = 'DRIVER_LOGIN_SUCCESS'
export const DRIVER_LOGIN_FAILURE = 'DRIVER_LOGIN_FAILURE'

export const UPDATE_PROFILE_STARTED = 'UPDATE_PROFILE_STARTED'
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS'
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE'

export const UPDATE_LOCATION_STARTED = 'UPDATE_LOCATION_STARTED'
export const UPDATE_LOCATION_SUCCESS = 'UPDATE_LOCATION_SUCCESS'
export const UPDATE_LOCATION_FAILURE = 'UPDATE_LOCATION_FAILURE'

// Should return a list of drivers nearby
export const updateDriverLocation = (location) => dispatch => {
	dispatch({type: UPDATE_LOCATION_STARTED})
	console.log('location',location)
	return (
		API.put('/api/driver/location')
		.then(res =>{
			console.log('res',res)
			dispatch({type: UPDATE_LOCATION_SUCCESS, payload: res})
		})
		.catch(err =>{
			dispatch({type: UPDATE_LOCATION_FAILURE, payload: err.message})
		})
	)
}
// Update Profile
export const updateProfile = (user) => dispatch => {
	dispatch({type: UPDATE_PROFILE_STARTED})
	return (
		API.put(`/api/users/${user.id}`)
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
		API.post('/signup', {...driver, role:'driver'})
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
	// return (API.post('/api/login', {...driver, driver:true})
	return (
		API.post('/signin', {...driver, role:'driver'})
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



// Find drivers nearby
// export const setDriverOnline = (driver) => dispatch => {
// 	console.log('setDriverOnline')
// 	dispatch({type: CONFIRM_TRIP_REQUEST, payload: driver})
// }
//


