import {
    LOGOUT_USER,
    OPEN_MODAL,
    TOGGLE_RESET_TRIP
} from './actionTypes'
import socket from "../utils/socketConnection";

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
    requestTrip,
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
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('requestDetails')
    localStorage.removeItem('currentDriver')
    socket.disconnect()
    dispatch({type: LOGOUT_USER})
}

export const toggleResetTrip = (isTrue) => dispatch => {
    console.log('resetTrip')
    localStorage.removeItem('requestDetails')
    localStorage.removeItem('currentDriver')
    
    dispatch({
        type:"TOGGLE_RESET_TRIP",
        payload:isTrue
    })
    return Promise.resolve();
}

export function openModal({shouldOpen, component}) {
    console.log('openModal component',component)
    return {
        type: OPEN_MODAL,
        shouldOpen,
        component
    }
}
