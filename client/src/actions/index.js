import {
	OPEN_MODAL
} from './actionTypes'

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
    logoutUser,
    getDriversById,
    findDriversNearby,
    signup_rider,
    login_rider,
    submitDriverReview,
    uploadRiderProfile,
    updateThisRiderLocation,
    riderCancelRequest
} from './riderAction'

export function openModal({shouldOpen, component}) {
    return {
        type: OPEN_MODAL,
        shouldOpen,
        component
    }
}
