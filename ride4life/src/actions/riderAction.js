// RIDER
import {API} from "../utils/axiosAuth";
import axios from "axios";

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


// Find drivers nearby
export const findDriversNearby = (location) => dispatch => {
	dispatch({type: FIND_DRIVERS_NEARBY_STARTED})
	return (
		API.get('/api/drivers')
		.then(res =>{
			dispatch({type: FIND_DRIVERS_NEARBY_SUCCESS, payload: res.data})
		})
		.catch(err => err.message)
	)
}
// Find drivers nearby
export const getDriversById = (driverId) => dispatch => {
	dispatch({type: FIND_DRIVER_BY_ID_STARTED})
	return (
		API.get(`/api/drivers/${driverId}`)
		.then(res =>{
			dispatch({type: FIND_DRIVER_BY_ID_SUCCESS, payload: res.data})
		})
		.catch(err => err.message)
	)
}



// LOGIN / SIGN UP
export const signup_rider = (rider) => dispatch => {
	dispatch({type: RIDER_SIGNUP_STARTED})
  	return (
		API.post('/api/register', {...rider, driver:false})
		.then(res =>{
			dispatch({type: RIDER_SIGNUP_SUCCESS, payload: res.data})
		})
		.catch(err => err.message)
	)
	
}

export const login_rider = (rider) => dispatch => {
	
	dispatch({type: RIDER_LOGIN_STARTED})
	return (
		API.post('/api/login', {...rider, driver:false})
		.then(res =>{
			dispatch({type: RIDER_LOGIN_SUCCESS, payload: res.data})
			
			localStorage.setItem('token', res.data.token)
		})
		.catch(err => err.message)
	)
}
export const logoutUser = () => dispatch => {
	dispatch({type: LOGOUT_USER})
}
// export const logoutUser= () => (
// 	{
// 		type: LOGOUT_USER
// 	}
// )




