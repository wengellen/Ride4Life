
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
s
}from '../actions'


const initialState = {
	riderSignupStarted: false,
	riderLoginStarted: false,
	findNearbyDriverStarted: false,
	findDriverByIdStarted: false,
	currentDriver:
		{
			"driver_id": 1,
			"username": "greatDriver",
			"reviews": [
				{
					"rider_id": 2,
					"review": "great ride",
					"rating": 5
				},
				{
					"rider_id": 5,
					"review": "way too bumpy, water broke on way to hospital",
					"rating": 2
				}
			]
		},
	requestDetails:{},
	driverProfile:
		{
			"driver_id": 1,
			"username": "greatDriver",
			"reviews": [
			{
				"rider_id": 2,
				"review": "great ride",
				"rating": 5
			},
			{
				"rider_id": 5,
				"review": "way too bumpy, water broke on way to hospital",
				"rating": 2
			}]
		},
		
		driversNearby:[
		{
			driver: 1,
			driver_id: 1,
			email: "rider1@rfl.com",
			location: "1234, 12345",
			password: "$2a$10$JhuN1iHpKfiV/mRSiyAJG.m1ZlOaUMtvvoZ4R7iUzTP5cljhx/edG",
			phone: "4159228525",
			username: "DriverProfile1",
		},
		// {
		// 	"id" : 7,
		// 	"displayName" : "Kingston",
		// 	"phone" : "07",
		// 	"email" : "driver01@gmail.com",
		// 	"earnedRatings" : 21,
		// 	"totalRatings" : 25,
		// 	"stars":5,
		// 	"location" : {
		// 		"type" : "Point",
		// 		"address" : "SS Environs, Chellikere, 1st block, Chelekare, Kalyan Nagar, Bengaluru, Karnataka 560043, India",
		// 		"coordinates" : [
		// 			77.63997110000003,
		// 			13.0280047
		// 		]
		// 	}
		// },
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
		case FIND_DRIVERS_NEARBY_STARTED:
			return {...state,
				findNearbyDriverStarted:true
			}
		case FIND_DRIVERS_NEARBY_SUCCESS:
			return {...state,
				findNearbyDriverStarted:false,
				driversNearby: action.payload || state.driversNearby
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
			return {...state,
				findDriverByIdStarted:false,
				currentDriver: action.payload || state.currentDriver
			}
		case FIND_DRIVER_BY_ID_FAILURE:
			return {...state,
				findDriverByIdStarted:false
			}
		default:
			return {...state}
	}
}
