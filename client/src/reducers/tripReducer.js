import {RESET_TRIP, START_TRIP} from '../actions/actionTypes'

export const tripReducer =  (state = {resetTrip:false}, action)=>{
	switch(action.type){
		case RESET_TRIP:
			return {
				...state,
				resetTrip:true
			}
		case START_TRIP:
			return {
				...state,
				resetTrip:false
			}
		default:
			return state
	}
}

