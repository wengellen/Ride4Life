import {combineReducers} from "redux";
import {driverReducer} from './driverReducer'
import {riderReducer} from './riderReducer'
import {modalReducer} from './modalReducer'

export default combineReducers({
	driverReducer,
	riderReducer,
	modalReducer
})
