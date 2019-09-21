
import {
	DRIVER_SIGNUP_STARTED,
	DRIVER_SIGNUP_SUCCESS,
	DRIVER_SIGNUP_FAILURE,
	DRIVER_LOGIN_STARTED,
	DRIVER_LOGIN_SUCCESS,
	DRIVER_LOGIN_FAILURE,
	LOGOUT_USER,
	UPDATE_PROFILE_STARTED,
	UPDATE_PROFILE_SUCCESS,
	UPDATE_PROFILE_FAILURE
} from '../actions/actionTypes'

const initialState = {
	user: JSON.parse(localStorage.getItem('user')),
	driverSignupStarted: false,
	driverLoginStarted: false,
	serverMessage:'',
	requestDetails:{},
	tripStatus:"standby", // findingTrip | confirmed
	driverDetails:[
		{
			"userId" : "01",
			"displayName" : "Cop 1",
			"phone" : "01",
			"email" : "cop01@gmail.com",
			"earnedRatings" : 21,
			"totalRatings" : 25,
			"location" : {
				"type" : "Point",
				"address" : "SS Environs, Chellikere, 1st block, Chelekare, Kalyan Nagar, Bengaluru, Karnataka 560043, India",
				"coordinates" : [
					77.63997110000003,
					13.0280047
				]
			}
		},
	],
}

export const driverReducer = (state = initialState, action)=>{
	switch(action.type){
		case DRIVER_SIGNUP_STARTED:
			return {...state,
				driverSignupStarted:true,
				serverMessage: 'Creating Driver Account...'
			}
		case DRIVER_SIGNUP_SUCCESS:
			return {...state,
				driverSignupStarted:false,
				serverMessage: 'Creating Driver Account Success'
			}
		
		case DRIVER_SIGNUP_FAILURE:
			return {...state,
				driverSignupStarted:false,
				serverMessage:action.payload.message,
			}
			
		case DRIVER_LOGIN_STARTED:
			return {...state,
				driverLoginStarted:true,
				serverMessage: 'Logging in...'
			}
		case DRIVER_LOGIN_SUCCESS:
			console.log('action.payload', action.payload)
			return {...state,
				user: action.payload.user,
				driverLoginStarted:false,
				serverMessage: 'Login Success'
			}
		case DRIVER_LOGIN_FAILURE:
		
			return {...state,
				driverLoginStarted:false,
				serverMessage:action.payload.message,
			}
		
		case UPDATE_PROFILE_STARTED:
			return {...state,
				serverMessage:'Uploading...',
			}
		case UPDATE_PROFILE_SUCCESS:
			return {...state,
				user: action.payload,
				serverMessage:action.payload.message,
			}
		case UPDATE_PROFILE_FAILURE:
			return {...state,
				serverMessage:action.payload.message,
			}
		case LOGOUT_USER:
			return {...state,
				user: null
			}
		default:
			return {...state}
	}
}
