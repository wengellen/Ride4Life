import {API} from "../utils/axiosAuth";

export const SEND_TRIP_REQUEST_STARTED = 'SEND_TRIP_REQUEST_STARTED'
export const SEND_TRIP_REQUEST_SUCCESS = 'SEND_TRIP_REQUEST_SUCCESS'
export const SEND_TRIP_REQUEST_FAILURE = 'SEND_TRIP_REQUEST_FAILURE'


// export const SEARCH_DRIVERS_NEARBY_STARTED = 'SEARCH_DRIVERS_NEARBY_STARTED'
// export const SEARCH_DRIVERS_NEARBY_SUCCESS = 'SEARCH_DRIVERS_NEARBY_SUCCESS'
// export const SEARCH_DRIVERS_NEARBY_FAILURE = 'SEARCH_DRIVERS_NEARBY_FAILURE'


// SEND_RIDE_REQUEST
// Should return a list of drivers nearby
export const sendTripRequest = (trip) => dispatch => {
	dispatch({type: SEND_TRIP_REQUEST_STARTED})
	return (
		API.post('/api/request-trip')
		.then(res =>{
			dispatch({type: SEND_TRIP_REQUEST_SUCCESS, payload: res.data})
		})
		.catch(err => err.message)
	)
}


// SEARCH DRIVERS
// export const sendRideRequest = (ride) => dispatch => {
// 	dispatch({type: SEARCH_DRIVERS_NEARBY_STARTED})
// 	return (
// 		axiosAuth().post('/request-ride')
// 		.then(res =>{
// 			dispatch({type: SEARCH_DRIVERS_NEARBY_SUCCESS, payload: res.data})
// 		})
// 		.catch(err => err.message)
// 	)
// }
