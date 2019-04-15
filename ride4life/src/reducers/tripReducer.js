
import {
}from '../actions'


const initialState = {
	requestDetails:{},
	driverDetails:{},
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
		}
}

export const tripReducer = (state = initialState, action)=>{
	switch(action.type){
		default:
			return {...state}
	}
}
