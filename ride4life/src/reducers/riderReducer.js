
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
	requestDetails:{
		riderDetails:
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
			},
		status:'pending'
	},
	// driverProfile:
	// 	{
	// 		"driver_id": 1,
	// 		"username": "greatDriver",
	// 		"reviews": [
	// 		{
	// 			"rider_id": 2,
	// 			"review": "great ride",
	// 			"rating": 5
	// 		},
	// 		{
	// 			"rider_id": 5,
	// 			"review": "way too bumpy, water broke on way to hospital",
	// 			"rating": 2
	// 		}]
	// 	},
		
		driversNearby:[],
		// {
		// 	driver: 1,
		// 	driver_id: 1,
		// 	email: "rider1@rfl.com",
		// 	location: "1234, 12345",
		// 	password: "$2a$10$JhuN1iHpKfiV/mRSiyAJG.m1ZlOaUMtvvoZ4R7iUzTP5cljhx/edG",
		// 	phone: "4159228525",
		// 	username: "DriverProfile1",
		// },
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
	
	loggedInUser:null
		// {
		// 	"requestTime" : {date:"2016-10-31T12:12:37.321Z"},
		// 	"location" : {
		// 		"coordinates" : [
		// 			77.612257,
		// 			12.934729
		// 		],
		// 		"address" : "The Forum, 21 Hosur Road, Bengaluru South, Karnataka, India"
		// 	},
		// 	"citizenId" : "citizen1",
		// 	"status" : "engaged",
		// 	"copId" : "06"
		// }
		// {
		// 	"message": "Welcome greatRider!",
		// 	"username":"rider1",
		// 	"driver":false,
		// 	"phone": 4125967234,
		// 	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdyZWF0UmlkZXIiLCJwaG9uZSI6IjMyMSIsImRyaXZlciI6MCwiaWF0IjoxNTU1NDI3NDU2LCJleHAiOjE1NTU1MTM4NTZ9.LPMSHq757G9JNoJPU_0Ifq1u3uJvipHqDVTHKYej6uY"
		// }
	
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
			console.log('RIDER_LOGIN_SUCCESS')
			console.log('action.payload,',action.payload)
			return {...state,
				riderLoginStarted:false,
				loggedInUser: action.payload
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
				currentDriver: {...action.payload}
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
			return {...state,
				sendTripRequestStarted:false
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
			return {...state,
				submitDriverReviewStarted:false
			}
		case SUBMIT_REVIEW_FAILURE:
			return {...state,
				submitDriverReviewStarted:false
			}
		default:
			return {...state}
	}
}
