import {OPEN_MODAL} from '../actions/actionTypes'

export const modalReducer =  (state = {}, action)=>{
	switch(action.type){
		case OPEN_MODAL:
			return {...state,
				shouldOpen: action.shouldOpen,
				component:action.component
			}
		default:
			return state
	}
}

