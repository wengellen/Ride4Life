import {
    LOGOUT_USER,
    OPEN_MODAL
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
    submitDriverReview,
    uploadRiderProfile,
    updateThisRiderLocation,
    riderCancelRequest
} from './riderAction'

export const logoutUser = () => dispatch => {
    console.log('logoutUser',logoutUser)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    socket.disconnect()
    dispatch({type: LOGOUT_USER})
}

export function openModal({shouldOpen, component}) {
    return {
        type: OPEN_MODAL,
        shouldOpen,
        component
    }
}
