import {
	LOGOUT_USER,
	OPEN_MODAL,
	USER_SIGNUP_FAILURE,
	USER_SIGNUP_STARTED,
	USER_SIGNUP_SUCCESS,
	USER_LOGIN_FAILURE,
	USER_LOGIN_STARTED,
	USER_LOGIN_SUCCESS,
	UPDATE_PROFILE_FAILURE,
	UPDATE_PROFILE_STARTED,
	UPDATE_PROFILE_SUCCESS,
	TOGGLE_RESET_TRIP,
} from './actionTypes'
import { getSocket } from '../utils/socketConnection'
import * as helper from '../utils/helpers'
import API from '../utils/axiosAuth'
import jwtDecoder from 'jwt-decode'
import { getToken } from '../utils/helpers'

export {
	updateDriverLocation,
	acceptTrip,
	driverGoOnline,
	driverGoOffline,
	driverCancelTrip,
	driverStartTrip,
	driverEndTrip,
	submitRiderReview,
} from './driverAction'

export {
	cancelTripRequest,
	riderCancelTrip,
	confirmTrip,
	riderRequestTrip,
	getDriversById,
	findDriversNearby,
	updateThisRiderLocation,
	riderCancelRequest,
	submitDriverReview,
} from './riderAction'

export const toggleResetTrip = isTrue => dispatch => {
	helper.removeTrip()
	dispatch({
		type: 'TOGGLE_RESET_TRIP',
		payload: isTrue,
	})
	return Promise.resolve()
}

export function openModal({ shouldOpen, component, data }) {
	return {
		type: OPEN_MODAL,
		shouldOpen,
		component,
		data,
	}
}

export const signupUser = ({ user, role }) => dispatch => {
	dispatch({ type: USER_SIGNUP_STARTED })
	return API()
		.post('/signup', { ...user, role })
		.then(res => {
			dispatch({ type: USER_SIGNUP_SUCCESS, payload: res.data })
			return res.data
		})
		.catch(error => {
			console.log(error.response)
			console.log(error.response.data.error)
			dispatch({
				type: USER_SIGNUP_FAILURE,
				payload: error.response.data.error,
			})
			return error.response
		})
}

export const loginUser = ({ user, role }) => dispatch => {
	dispatch({ type: USER_LOGIN_STARTED })
	
	return API()
		.post('/signin', { ...user, role })
		.then(res => {
			const { token } = res.data
			helper.setToken(token)
			const user = jwtDecoder(getToken())
			console.log('user',user)
			dispatch({ type: USER_LOGIN_SUCCESS, payload: user })
			return res.data
		})
		.catch(err => {
			if (err.response && err.response.status === 401) {
				dispatch({
					type: USER_LOGIN_FAILURE,
					payload: err.response.data.message,
				})
			}

			return err.response
		})
}

export const logoutUser = () => dispatch => {
	localStorage.clear()
	if (getSocket()) {
		getSocket().disconnect()
	}
	dispatch({ type: LOGOUT_USER })
}

export const uploadProfile = ({ formValue, role }) => dispatch => {
	dispatch({ type: UPDATE_PROFILE_STARTED })
	return API()
		.post(`/api/${role}/update-profile`, formValue)
		.then(res => {
			console.log('uploadProfile', res)
			dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: res.data })
			return res.data
		})
		.catch(err => {
			console.log('err', err)
			if (err.response && err.response.status === 401) {
				dispatch({
					type: UPDATE_PROFILE_FAILURE,
					payload: err.response.data,
				})
			}

			return err.response.data
		})
}
