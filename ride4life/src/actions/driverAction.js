
// DRIVER
import {API} from "../utils/axiosAuth";
import axios from 'axios'
import {RIDER_LOGIN_FAILURE, RIDER_SIGNUP_FAILURE} from "./riderAction";

export const DRIVER_SIGNUP_STARTED = 'DRIVER_SIGNUP_STARTED'
export const DRIVER_SIGNUP_SUCCESS = 'DRIVER_SIGNUP_SUCCESS'
export const DRIVER_SIGNUP_FAILURE = 'DRIVER_SIGNUP_FAILURE'

export const DRIVER_LOGIN_STARTED = 'DRIVER_LOGIN_STARTED'
export const DRIVER_LOGIN_SUCCESS = 'DRIVER_LOGIN_SUCCESS'
export const DRIVER_LOGIN_FAILURE = 'DRIVER_LOGIN_FAILURE'

export const UPDATE_PROFILE_STARTED = 'UPDATE_PROFILE_STARTED'
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS'
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE'


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
	// console.log('signup_driver',driver)
	dispatch({type:DRIVER_SIGNUP_STARTED})
	// return (
		return axios.post('https://ride-for-life.herokuapp.com/api/register', {...driver, driver:true})
		.then(res =>{
			dispatch({type: DRIVER_SIGNUP_SUCCESS, payload: res.data})
			return res.data
		})
		.catch(error => {
			console.log(error.response)
			console.log( error.response.data.error)
			dispatch({type: DRIVER_SIGNUP_FAILURE, payload: error.response.data.error})
			return error.response
		})
	// )
}

export const login_driver= (driver) => dispatch =>{
	dispatch({type:DRIVER_LOGIN_STARTED})
	// return (API.post('/api/login', {...driver, driver:true})
	return axios.post('https://ride-for-life.herokuapp.com/api/login', {...driver, driver:true})
	   .then(res =>{
			localStorage.setItem('token', res.data.token)
		   dispatch({type: DRIVER_LOGIN_SUCCESS, payload: res.data})
		   return res.data
		})
		.catch(err =>{
			console.log('err', err.response.error)
			if (err.response.status === 401) {
				dispatch({type: DRIVER_LOGIN_FAILURE, payload: err.response.data.message})
			}
			return err.response
		})
}

