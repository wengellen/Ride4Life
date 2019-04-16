
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
s
}from '../actions'


const initialState = {
	riderSignupStarted: false,
	riderLoginStarted: false,
	findNearbyDriverStarted: false,
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
			"id" : 1,
			"displayName" : "Martin",
			"phone" : "01",
			"email" : "driver01@gmail.com",
			"earnedRatings" : 21,
			"totalRatings" : 25,
			"stars":4,
			"location" : {
				"type" : "Point",
				"address" : "SS Environs, Chellikere, 1st block, Chelekare, Kalyan Nagar, Bengaluru, Karnataka 560043, India",
				"coordinates" : [
					77.63997110000003,
					13.0280047
				]
			}
		},
		{
			"id" : 2,
			"displayName" : "Kingston",
			"phone" : "02",
			"email" : "driver01@gmail.com",
			"earnedRatings" : 21,
			"totalRatings" : 25,
			"stars":5,
			"location" : {
				"type" : "Point",
				"address" : "SS Environs, Chellikere, 1st block, Chelekare, Kalyan Nagar, Bengaluru, Karnataka 560043, India",
				"coordinates" : [
					77.63997110000003,
					13.0280047
				]
			}
		},
		{
			"id" : 3,
			"displayName" : "Kingston",
			"phone" : "03",
			"email" : "driver01@gmail.com",
			"earnedRatings" : 21,
			"totalRatings" : 25,
			"stars":5,
			"location" : {
				"type" : "Point",
				"address" : "SS Environs, Chellikere, 1st block, Chelekare, Kalyan Nagar, Bengaluru, Karnataka 560043, India",
				"coordinates" : [
					77.63997110000003,
					13.0280047
				]
			}
		},
		{
			"id" : 4,
			"displayName" : "Kingston",
			"phone" : "04",
			"email" : "driver01@gmail.com",
			"earnedRatings" : 21,
			"totalRatings" : 25,
			"stars":5,
			"location" : {
				"type" : "Point",
				"address" : "SS Environs, Chellikere, 1st block, Chelekare, Kalyan Nagar, Bengaluru, Karnataka 560043, India",
				"coordinates" : [
					77.63997110000003,
					13.0280047
				]
			}
		},
		{
			"id" : 5,
			"displayName" : "Kingston",
			"phone" : "05",
			"email" : "driver01@gmail.com",
			"earnedRatings" : 21,
			"totalRatings" : 25,
			"stars":5,
			"location" : {
				"type" : "Point",
				"address" : "SS Environs, Chellikere, 1st block, Chelekare, Kalyan Nagar, Bengaluru, Karnataka 560043, India",
				"coordinates" : [
					77.63997110000003,
					13.0280047
				]
			}
		},
		{
			"id" : 6,
			"displayName" : "Kingston",
			"phone" : "06",
			"email" : "driver01@gmail.com",
			"earnedRatings" : 21,
			"totalRatings" : 25,
			"stars":5,
			"location" : {
				"type" : "Point",
				"address" : "SS Environs, Chellikere, 1st block, Chelekare, Kalyan Nagar, Bengaluru, Karnataka 560043, India",
				"coordinates" : [
					77.63997110000003,
					13.0280047
				]
			}
		},
		{
			"id" : 7,
			"displayName" : "Kingston",
			"phone" : "07",
			"email" : "driver01@gmail.com",
			"earnedRatings" : 21,
			"totalRatings" : 25,
			"stars":5,
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
		default:
			return {...state}
	}
}
