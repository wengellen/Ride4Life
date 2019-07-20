import {combineReducers} from "redux";
import {driverReducer} from './driverReducer'
import {riderReducer} from './riderReducer'

export default combineReducers({
	driverReducer,
	riderReducer,
})
