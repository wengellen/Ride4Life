
import {
	SEND_TRIP_REQUEST_STARTED,
	SEND_TRIP_REQUEST_SUCCESS,
	SEND_TRIP_REQUEST_FAILURE
} from '../actions'

const initialState = {
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
	driversNearby:[],
	sendTripRequestStarted:false
}

export const tripReducer = (state = initialState, action)=>{
	switch(action.type){
		case SEND_TRIP_REQUEST_STARTED:
			return {...state,
				sendTripRequestStarted:true
			}
		case SEND_TRIP_REQUEST_SUCCESS:
			return {...state,
				sendTripRequestStarted:true
			}
		case SEND_TRIP_REQUEST_FAILURE:
			return {...state,
				sendTripRequestStarted:true
			}
		
		default:
			return {...state}
	}
}
