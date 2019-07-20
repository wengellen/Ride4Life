
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
} from '../actions'


const initialState = {
	riderSignupStarted: false,
	riderLoginStarted: false,
	findNearbyDriverStarted: false,
	findDriverByIdStarted: false,
	sendTripRequestStarted:false,
	submitDriverReviewStarted:false,
	submitDriverReviewSuccessMessage:'',
	currentDriver:{},
	activeTrip:{},
		driversNearby:[],
	loggedInUser:null,
	serverMessage:''
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
				loggedInUser: action.payload,
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
				findNearbyDriverStarted:true
			}
		case FIND_DRIVERS_NEARBY_SUCCESS:
			return {...state,
				findNearbyDriverStarted:false,
				driversNearby: action.payload
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
			
		case LOGOUT_USER:
			return {...state,
				loggedInUser: null
			}
			
		case SEND_TRIP_REQUEST_STARTED:
			return {...state,
				sendTripRequestStarted:true
			}
		case SEND_TRIP_REQUEST_SUCCESS:
			console.log('SEND_TRIP_REQUEST_SUCCESS action.payload', action.payload)
			return {...state,
				sendTripRequestStarted:false,
				activeTrip: action.payload
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
		default:
			return {...state}
	}
}
