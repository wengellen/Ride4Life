
import {
	RIDER_SIGNUP_STARTED,
	RIDER_SIGNUP_SUCCESS,
	RIDER_SIGNUP_FAILURE,
	RIDER_LOGIN_STARTED,
	RIDER_LOGIN_SUCCESS,
	RIDER_LOGIN_FAILURE,
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
	SUBMIT_REVIEW_STARTED,
	SUBMIT_REVIEW_SUCCESS,
	SUBMIT_REVIEW_FAILURE,
	UPDATE_RIDER_PROFILE_STARTED,
	UPDATE_RIDER_PROFILE_SUCCESS,
	UPDATE_RIDER_PROFILE_FAILURE,
	CANCEL_TRIP_REQUEST,
	CONFIRM_TRIP_REQUEST,
	UPDATE_PROFILE_STARTED,
	UPDATE_PROFILE_SUCCESS,
	UPDATE_PROFILE_FAILURE
} from '../actions/actionTypes'


const initialState = {
	riderSignupStarted: false,
	riderLoginStarted: false,
	findNearbyDriverStarted: false,
	findDriverByIdStarted: false,
	findNearbyDriverMessage: 'Welcome back',
	tripStatus:'standby',
	sendTripRequestStarted:false,
	submitDriverReviewStarted:false,
	submitDriverReviewSuccessMessage:'',
	currentDriver:{},
	activeTrip:{},
    driversNearby:[],
	user:JSON.parse(localStorage.getItem('user')),
	serverMessage:'',
}

export const riderReducer = (state = initialState, action)=>{
	switch(action.type){
		
		case RIDER_SIGNUP_STARTED:
			return {...state,
				riderSignupStarted:true,
				serverMessage: 'Creating User Account...'
			}
		case RIDER_SIGNUP_SUCCESS:
			return {...state,
				riderSignupStarted:false,
				serverMessage: 'Creating User Account Success'
			}
		case RIDER_SIGNUP_FAILURE:
			console.log('RIDER_SIGNUP_FAILURE', action.payload)
			return {...state,
				riderSignupStarted:false,
				serverMessage:action.payload
			}
			
		case RIDER_LOGIN_STARTED:
			return {...state,
				riderLoginStarted:true,
				serverMessage: 'Logging in...'
			}
		case RIDER_LOGIN_SUCCESS:
			return {...state,
				riderLoginStarted:false,
				user: action.payload.user,
				serverMessage: 'Login Success'
			}
		case RIDER_LOGIN_FAILURE:
			console.log('this.state',action.payload)
			
			return {...state,
				riderLoginStarted:false,
				serverMessage:action.payload
			}
		case FIND_DRIVERS_NEARBY_STARTED:
			return {...state,
				findNearbyDriverStarted:true,
				findNearbyDriverMessage:"Finding Rides for you"
			}
		case FIND_DRIVERS_NEARBY_SUCCESS:
			return {...state,
				findNearbyDriverStarted:false,
				findNearbyDriverMessage:`${action.payload.length} drivers responded`,
				driversNearby: action.payload,
				tripStatus: "requesting"
			}
		case FIND_DRIVERS_NEARBY_FAILURE:
			return {...state,
				findNearbyDriverStarted:false
			}
			
		// 	FIND_DRIVER_BY_ID_STARTED
		case FIND_DRIVER_BY_ID_STARTED:
			return {...state,
				findDriverByIdStarted:true
			}
		case FIND_DRIVER_BY_ID_SUCCESS:
			console.log('currentDriver', action.payload)
			return {...state,
				findDriverByIdStarted:false,
				currentDriver: action.payload
			}
		case FIND_DRIVER_BY_ID_FAILURE:
			return {...state,
				findDriverByIdStarted:false
			}
			
		case CANCEL_TRIP_REQUEST:
			return {...state,
				findNearbyDriverMessage: 'Choose another destination',
				driversNearby:[],
				tripStatus: "standby"
			}
		
		case CONFIRM_TRIP_REQUEST:
			return {...state,
				findNearbyDriverMessage: 'Your rider is on the way',
				driversNearby:[action.payload],
				tripStatus:"pickup"
			}

		case LOGOUT_USER:
			return {...state,
				user: null
			}
			
		case SEND_TRIP_REQUEST_STARTED:
			return {...state,
				sendTripRequestStarted:true
			}
		case SEND_TRIP_REQUEST_SUCCESS:
			console.log('SEND_TRIP_REQUEST_SUCCESS action.payload', action.payload)
			return {...state,
				sendTripRequestStarted:false,
				activeTrip: action.payload,
				// tripStatus: "requesting"
			}
		case SEND_TRIP_REQUEST_FAILURE:
			return {...state,
				sendTripRequestStarted:false
			}
		case SUBMIT_REVIEW_STARTED:
			return {...state,
				submitDriverReviewStarted:true
			}
		case SUBMIT_REVIEW_SUCCESS:
			console.log('action.payload.message',action.payload.message)
			return {...state,
				submitDriverReviewStarted:false,
				submitDriverReviewSuccessMessage:action.payload.message
			}
		case SUBMIT_REVIEW_FAILURE:
			return {...state,
				submitDriverReviewStarted:false
			}
		
		case UPDATE_RIDER_PROFILE_STARTED:
			return {...state,
				serverMessage:'Uploading...',
			}
		case UPDATE_RIDER_PROFILE_SUCCESS:
			return {...state,
				user: action.payload,
				serverMessage:action.payload.message,
			}
		case UPDATE_RIDER_PROFILE_FAILURE:
			return {...state,
				serverMessage:action.payload.message,
			}
		default:
			return {...state}
	}
}
