import {
	FIND_DRIVERS_NEARBY_STARTED,
	FIND_DRIVERS_NEARBY_SUCCESS,
	FIND_DRIVERS_NEARBY_FAILURE,
	FIND_DRIVER_BY_ID_STARTED,
	FIND_DRIVER_BY_ID_SUCCESS,
	FIND_DRIVER_BY_ID_FAILURE,
	LOGOUT_USER,
	SEND_TRIP_REQUEST_STARTED,
	SEND_TRIP_REQUEST_SUCCESS,
	SEND_TRIP_REQUEST_FAILURE,
	SUBMIT_DRIVER_REVIEW_STARTED,
	SUBMIT_DRIVER_REVIEW_SUCCESS,
	SUBMIT_DRIVER_REVIEW_FAILURE,
	CANCEL_TRIP_REQUEST,
	CONFIRM_TRIP_REQUEST,
	UPDATE_RIDER_PROFILE_STARTED,
	UPDATE_RIDER_PROFILE_SUCCESS,
	UPDATE_RIDER_PROFILE_FAILURE,
	UPDATE_PROFILE_STARTED,
	UPDATE_PROFILE_SUCCESS,
	UPDATE_PROFILE_FAILURE,
	USER_LOGIN_STARTED,
	USER_LOGIN_SUCCESS,
	USER_LOGIN_FAILURE,
	OPEN_MODAL,
	TOGGLE_RESET_TRIP,
} from '../actions/actionTypes'

const initialState = {
	loggedInUser: null,
	userSignupStarted: false,
	userLoginStarted: false,
	findNearbyDriverStarted: false,
	findDriverByIdStarted: false,
	findNearbyDriverMessage: 'Welcome back',
	tripStatus: 'standby',
	sendTripRequestStarted: false,
	submitDriverReviewStarted: false,
	submitDriverReviewSuccessMessage: '',
	currentDriver: null,
	activeTrip: null,
	driversNearby: [],
	serverMessage: '',
	driverDetails: [
		{
			userId: '01',
			displayName: 'Jimmy',
			phone: '01',
			email: 'jimmy1@gmail.com',
			earnedRatings: 21,
			totalRatings: 25,
			location: {
				type: 'Point',
				address:
					'SS Environs, Chellikere, 1st block, Chelekare, Kalyan Nagar, Bengaluru, Karnataka 560043, India',
				coordinates: [77.63997110000003, 13.0280047],
			},
		},
	],
}

export const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case USER_LOGIN_STARTED:
			return {
				...state,
				riderLoginStarted: true,
				serverMessage: 'Logging in...',
			}
		case USER_LOGIN_SUCCESS:
			return {
				...state,
				riderLoginStarted: false,
				loggedInUser: action.payload,
				serverMessage: 'Login Success',
			}
		case USER_LOGIN_FAILURE:
			console.log('this.state', action.payload)

			return {
				...state,
				riderLoginStarted: false,
				serverMessage: action.payload,
			}

		case LOGOUT_USER:
			return { ...state, loggedInUser: null }

		case OPEN_MODAL:
			return {
				...state,
				shouldOpen: action.shouldOpen,
				component: action.component,
				data: action.data,
			}
		case TOGGLE_RESET_TRIP:
			return {
				...state,
				shouldResetTrip: action.payload,
			}
		case FIND_DRIVERS_NEARBY_STARTED:
			return {
				...state,
				findNearbyDriverStarted: true,
				findNearbyDriverMessage: 'Finding Rides for you',
			}
		case FIND_DRIVERS_NEARBY_SUCCESS:
			return {
				...state,
				findNearbyDriverStarted: false,
				findNearbyDriverMessage: `${action.payload.length} drivers responded`,
				driversNearby: action.payload,
				tripStatus: 'requesting',
			}
		case FIND_DRIVERS_NEARBY_FAILURE:
			return { ...state, findNearbyDriverStarted: false }

		// 	FIND_DRIVER_BY_ID_STARTED
		case FIND_DRIVER_BY_ID_STARTED:
			return { ...state, findDriverByIdStarted: true }
		case FIND_DRIVER_BY_ID_SUCCESS:
			console.log('currentDriver', action.payload)
			return {
				...state,
				findDriverByIdStarted: false,
				currentDriver: action.payload,
			}
		case FIND_DRIVER_BY_ID_FAILURE:
			return { ...state, findDriverByIdStarted: false }

		case CANCEL_TRIP_REQUEST:
			return {
				...state,
				findNearbyDriverMessage: 'Choose another destination',
				driversNearby: [],
				tripStatus: 'standby',
			}

		case CONFIRM_TRIP_REQUEST:
			return {
				...state,
				findNearbyDriverMessage: 'Your rider is on the way',
				driversNearby: [action.payload],
				tripStatus: 'pickup',
			}

		case SEND_TRIP_REQUEST_STARTED:
			return { ...state, sendTripRequestStarted: true }
		case SEND_TRIP_REQUEST_SUCCESS:
			console.log(
				'SEND_TRIP_REQUEST_SUCCESS action.payload',
				action.payload
			)
			return {
				...state,
				sendTripRequestStarted: false,
				activeTrip: action.payload,
				// tripStatus: "requesting"
			}
		case SEND_TRIP_REQUEST_FAILURE:
			return { ...state, sendTripRequestStarted: false }
		case SUBMIT_DRIVER_REVIEW_STARTED:
			return { ...state, submitDriverReviewStarted: true }
		case SUBMIT_DRIVER_REVIEW_SUCCESS:
			console.log('action.payload.message', action.payload.message)
			return {
				...state,
				submitDriverReviewStarted: false,
				submitDriverReviewSuccessMessage: action.payload.message,
			}
		case SUBMIT_DRIVER_REVIEW_FAILURE:
			return { ...state, submitDriverReviewStarted: false }

		case UPDATE_PROFILE_STARTED:
			return { ...state, serverMessage: 'Updating...' }
		case UPDATE_PROFILE_SUCCESS:
			return {
				...state,
				loggedInUser: action.payload,
				serverMessage: action.payload.message,
			}
		case UPDATE_PROFILE_FAILURE:
			return { ...state, serverMessage: action.payload.message }

		case UPDATE_RIDER_PROFILE_STARTED:
			return { ...state, serverMessage: 'Uploading...' }
		case UPDATE_RIDER_PROFILE_SUCCESS:
			return {
				...state,
				loggedInUser: action.payload,
				serverMessage: action.payload.message,
			}
		case UPDATE_RIDER_PROFILE_FAILURE:
			return { ...state, serverMessage: action.payload.message }
		default:
			return { ...state }
	}
}
