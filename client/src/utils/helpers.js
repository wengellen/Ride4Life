import jwtDecoder from 'jwt-decode'

const bp = {
	smaller: 321,
	small: 501,
	large: 1201,
}

export const getToken = () => {
	return localStorage.getItem('token')
}
//
export const getUser = () => {
	const token = localStorage.getItem('token')
	if (token) {
		return jwtDecoder(token)
	}
}

export const setToken = token => {
	localStorage.setItem('token', token)
}

export const removeTrip = () => {
	localStorage.removeItem('requestDetails')
}

export const minW = n => {
	const temp = Object.keys(bp).map(key => [key, bp[key]])

	const [result] = temp.reduce((acc, [name, size]) => {
		if (n === name) return [...acc, `@media (min-width: ${size}px)`]
		return acc
	}, [])

	return result
}

export const getMiles = distance => {
	return Math.round(distance * 0.000621371192)
}

export const getMinutes = duration => {
	return Math.round(duration / 60)
}
