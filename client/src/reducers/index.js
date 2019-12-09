import {combineReducers} from "redux";
import {driverReducer} from './driverReducer'
import {riderReducer} from './riderReducer'
import {modalReducer} from './modalReducer'
import {tripReducer} from './tripReducer'

export default combineReducers({
	driverReducer,
	riderReducer,
	modalReducer,
	tripReducer
})
