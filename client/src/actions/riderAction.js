// RIDER
import {API} from "../utils/axiosAuth";

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

export const SUBMIT_REVIEW_STARTED = 'SUBMIT_REVIEW_STARTED'
export const SUBMIT_REVIEW_SUCCESS = 'SUBMIT_REVIEW_SUCCESS'
export const SUBMIT_REVIEW_FAILURE = 'SUBMIT_REVIEW_FAILURE'


// SEND_RIDE_REQUEST
// Should return a list of drivers nearby
export const sendTripRequest = (trip) => dispatch => {
	dispatch({type: SEND_TRIP_REQUEST_STARTED})
	console.log('trip',trip)
	return (
		API.post('/api/rider/request')
		.then(res =>{
			// console.log('sendTripRequest',res)
			console.log('res',res)
			dispatch({type: SEND_TRIP_REQUEST_SUCCESS, payload: res})
		})
		.catch(err =>{
			dispatch({type: SEND_TRIP_REQUEST_FAILURE, payload: err.message})
		})
	)
}

// Should return a list of drivers nearby
export const updateRiderLocation = (location) => dispatch => {
	dispatch({type: UPDATE_LOCATION_STARTED})
	console.log('rider location',location)
	return (
		API.put('/api/rider/location')
		.then(res =>{
			console.log('res',res)
			dispatch({type: UPDATE_LOCATION_SUCCESS, payload: res})
		})
		.catch(err =>{
			dispatch({type: UPDATE_LOCATION_FAILURE, payload: err.message})
		})
	)
}

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
		API.post('/api/drivers/reviews', requestPayload)
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
		API.get('/api/rider/drivers')
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
		API.get(`/api/driver/${driverId}`)
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
		API.post('/signup', {...rider, role:'rider'})
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
		API.post('/signin', {...rider, role:'rider'})
		.then(res =>{
			localStorage.setItem('token', res.data.token)
			localStorage.setItem('user', JSON.stringify(res.data.user))
			console.log('res.data',res.data)
			// localStorage.setItem('loggedInUser', JSON.stringify({...res.data}))
			dispatch({type: RIDER_LOGIN_SUCCESS, payload: res.data})
			return res.data
		})
		.catch(err =>{
			if (err.response.status === 401) {
				dispatch({type: RIDER_LOGIN_FAILURE, payload: err.response.data.message})
			}
			return err.response
		})
	)
}
export const logoutUser = () => dispatch => {
	localStorage.removeItem('token')
	localStorage.removeItem('loggedInUser')
	dispatch({type: LOGOUT_USER})
}




