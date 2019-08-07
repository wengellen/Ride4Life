
import {
	DRIVER_SIGNUP_STARTED,
	DRIVER_SIGNUP_SUCCESS,
	DRIVER_SIGNUP_FAILURE,
	DRIVER_LOGIN_STARTED,
	DRIVER_LOGIN_SUCCESS,
	DRIVER_LOGIN_FAILURE,
}from '../actions'


const initialState = {
	user:null,
	driverSignupStarted: false,
	driverLoginStarted: false,
	serverMessage:'',
	requestDetails:{},
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
		default:
			return {...state}
	}
}
