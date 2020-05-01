import {
	OPEN_MODAL,
	USER_LOGIN_STARTED,
	USER_LOGIN_SUCCESS,
	USER_LOGIN_FAILURE,
	LOGOUT_USER,
	TOGGLE_RESET_TRIP,
} from '../actions/actionTypes'

const initialState = {
	shouldOpen: false,
	component: false,
	data: false,
}
export const modalReducer = (state = {}, action) => {
	switch (action.type) {
		case OPEN_MODAL:
			return {
				...state,
				shouldOpen: action.shouldOpen,
				component: action.component,
				data: action.data,
			}
		default:
			return state
	}
}
