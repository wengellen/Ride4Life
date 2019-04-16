// RIDER
import axiosAuth from "../utils/axiosAuth";

export const RIDER_SIGNUP_STARTED = 'RIDER_SIGNUP_STARTED'
export const RIDER_SIGNUP_SUCCESS = 'RIDER_SIGNUP_SUCCESS'
export const RIDER_SIGNUP_FAILURE = 'RIDER_SIGNUP_FAILURE'

export const RIDER_LOGIN_STARTED = 'RIDER_LOGIN_STARTED'
export const RIDER_LOGIN_SUCCESS = 'RIDER_LOGIN_SUCCESS'
export const RIDER_LOGIN_FAILURE = 'RIDER_LOGIN_FAILURE'


// RIDER
export const signup_rider = (rider) => dispatch => {
	dispatch({type: RIDER_SIGNUP_STARTED})
	// return (
	// 	new Promise((resolve, reject) => {
	// 		setTimeout(() => (
	// 			resolve(dispatch({type: RIDER_SIGNUP_SUCCESS, payload: rider}))
	// 		), 3000)
	// 	})
	// 	.then(res => res)
	// 	.catch(err => err)
	// )
	return (
		axiosAuth().post('/register', {...rider, driver:false})
		.then(res =>{
			dispatch({type: RIDER_SIGNUP_SUCCESS, payload: res.data})
		})
		.catch(err => err.message)
	)
}

export const login_rider = (rider) => dispatch => {
	dispatch({type: RIDER_LOGIN_STARTED})
	// return (
	// 	new Promise((resolve, reject) => {
	// 		setTimeout(() => (
	// 			resolve(dispatch({type: RIDER_LOGIN_SUCCESS, payload: rider}))
	// 		), 3000)
	// 	})
	// 	.then(res => res)
	// 	.catch(err => err)
	// )
	return (
		axiosAuth().post('/login', {...rider, driver:false})
		.then(res =>{
			dispatch({type: RIDER_LOGIN_SUCCESS, payload: res.data})
			localStorage.setItem('token', res.data.token)
		})
		.catch(err => err.message)
	)
}
