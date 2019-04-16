
import {
	RIDER_SIGNUP_STARTED,
	RIDER_SIGNUP_SUCCESS,
	RIDER_SIGNUP_FAILURE,
	RIDER_LOGIN_STARTED,
	RIDER_LOGIN_SUCCESS,
	RIDER_LOGIN_FAILURE,
}from '../actions'


const initialState = {
	riderSignupStarted: false,
	riderLoginStarted: false,
	requestDetails:{},
	driversNearby:[
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
	
	riderProfile:
		{
			"requestTime" : {date:"2016-10-31T12:12:37.321Z"},
			"location" : {
				"coordinates" : [
					77.612257,
					12.934729
				],
				"address" : "The Forum, 21 Hosur Road, Bengaluru South, Karnataka, India"
			},
			"citizenId" : "citizen1",
			"status" : "engaged",
			"copId" : "06"
		}
}

export const riderReducer = (state = initialState, action)=>{
	switch(action.type){
		case RIDER_SIGNUP_STARTED:
			return {...state,
				riderSignupStarted:true
			}
		case RIDER_SIGNUP_SUCCESS:
			return {...state,
				riderSignupStarted:false
			}
		case RIDER_SIGNUP_FAILURE:
			return {...state,
				riderSignupStarted:false
			}
			
		case RIDER_LOGIN_STARTED:
			return {...state,
				riderLoginStarted:true
			}
		case RIDER_LOGIN_SUCCESS:
			return {...state,
				riderLoginStarted:false,
				riderProfile: action.payload
			}
		case RIDER_LOGIN_FAILURE:
			return {...state,
				riderLoginStarted:false
			}
		default:
			return {...state}
	}
}
