
// DRIVER
import axiosAuth from "../utils/axiosAuth";

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
		axiosAuth().put(`/users/${user.id}`)
		.then(res =>{
			dispatch({type: UPDATE_PROFILE_SUCCESS, payload: res.data})
		})
		.catch(err => err.message)
	)
}


// DRIVER
export const signup_driver= (driver) => dispatch =>{
	console.log('signup_driver',driver)
	dispatch({type:DRIVER_SIGNUP_STARTED})
	// return (
		axiosAuth().post('/register', {...driver, driver:true})
		.then(res =>{
			dispatch({type: DRIVER_SIGNUP_SUCCESS, payload: res.data})
		})
		.catch(err => err.message)
	// )
}

export const login_driver= (driver) => dispatch =>{
	dispatch({type:DRIVER_LOGIN_STARTED})
	return (axiosAuth().post('/login', {...driver, driver:true})
		.then(res =>{
			dispatch({type: DRIVER_LOGIN_SUCCESS, payload: res.data})
			localStorage.setItem('token', res.data.token)
		})
		.catch(err => err.message)
	)
}

