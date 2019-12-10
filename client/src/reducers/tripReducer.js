import {TOGGLE_RESET_TRIP} from '../actions/actionTypes'

export const tripReducer =  (state = {shouldResetTrip:false}, action)=>{
	switch(action.type){
		case TOGGLE_RESET_TRIP:
			console.log('action.payload',action.payload)
			return {
				...state,
				shouldResetTrip: action.payload
			}
		// case START_TRIP:
		// 	return {
		// 		...state,
		// 		resetTrip:false
		// 	}
		default:
			return state
	}
}

