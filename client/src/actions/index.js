import {
    LOGOUT_USER,
    OPEN_MODAL,
    TOGGLE_RESET_TRIP
} from './actionTypes'
import {getSocket} from "../utils/socketConnection";
import * as helper from "../utils/helpers";

export {
    updateDriverLocation,
    updateProfile,
    signup_driver,
    login_driver,
    uploadProfile,
    acceptTrip,
    driverGoOnline,
    driverGoOffline,
    driverCancelTrip,
    driverStartTrip,
    driverEndTrip,
    submitRiderReview
} from './driverAction'

export {
    cancelTripRequest,
    riderCancelTrip,
    confirmTrip,
    riderRequestTrip,
    getDriversById,
    findDriversNearby,
    signup_rider,
    login_rider,
    uploadRiderProfile,
    updateThisRiderLocation,
    riderCancelRequest,
    submitDriverReview
} from './riderAction'

export const logoutUser = () => dispatch => {
    console.log('logoutUser',logoutUser)
    helper.removeToken()
    helper.removeTrip()
    // removeLocalStore('requestDetails')
    if (getSocket()){
        getSocket().disconnect()
    }
    console.log('socket',getSocket())
    dispatch({type: LOGOUT_USER})
}

export const toggleResetTrip = (isTrue) => dispatch => {
    helper.removeTrip()
    // removeLocalStore('currentDriver')
    dispatch({
        type:"TOGGLE_RESET_TRIP",
        payload:isTrue
    })
    return Promise.resolve();
}

export function openModal({shouldOpen, component, data}) {
    console.log('openModal component',component)
    console.log('openModal data',data)
    return {
        type: OPEN_MODAL,
        shouldOpen,
        component,
        data
    }
}
