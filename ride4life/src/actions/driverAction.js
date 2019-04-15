
// DRIVER
export const DRIVER_SIGNUP_STARTED = 'DRIVER_SIGNUP_STARTED'
export const DRIVER_SIGNUP_SUCCESS = 'DRIVER_SIGNUP_SUCCESS'
export const DRIVER_SIGNUP_FAILURE = 'DRIVER_SIGNUP_FAILURE'

export const DRIVER_LOGIN_STARTED = 'DRIVER_LOGIN_STARTED'
export const DRIVER_LOGIN_SUCCESS = 'DRIVER_LOGIN_SUCCESS'
export const DRIVER_LOGIN_FAILURE = 'DRIVER_LOGIN_FAILURE'



// DRIVER
export const signup_driver= (driver) => dispatch =>{
	dispatch({type:DRIVER_SIGNUP_STARTED})
}

export const login_driver= (driver) => dispatch =>{
	dispatch({type:DRIVER_LOGIN_STARTED})
}
