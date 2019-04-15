// RIDER
export const RIDER_SIGNUP_STARTED = 'RIDER_SIGNUP_STARTED'
export const RIDER_SIGNUP_SUCCESS = 'RIDER_SIGNUP_SUCCESS'
export const RIDER_SIGNUP_FAILURE = 'RIDER_SIGNUP_FAILURE'

export const RIDER_LOGIN_STARTED = 'RIDER_LOGIN_STARTED'
export const RIDER_LOGIN_SUCCESS = 'RIDER_LOGIN_SUCCESS'
export const RIDER_LOGIN_FAILURE = 'RIDER_LOGIN_FAILURE'


// RIDER
export const signup_rider = (rider)  => dispatch =>{
	dispatch({type:RIDER_SIGNUP_STARTED})
}

export const login_rider= (rider)  => dispatch =>{
	dispatch({type:RIDER_LOGIN_STARTED})
}
