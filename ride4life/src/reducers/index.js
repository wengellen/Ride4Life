import {combineReducers} from "redux";
import {driverReducer} from './driverReducer'
import {riderReducer} from './riderReducer'
import {tripReducer} from './tripReducer'

export default combineReducers({
	driverReducer,
	riderReducer,
	tripReducer,
})
