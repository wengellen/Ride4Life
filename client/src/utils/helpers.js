import jwtDecoder from 'jwt-decode'

const bp = {
	smaller: 321,
	small: 501,
	large: 1201,
};

export const getToken = () => {
	return localStorage.getItem('token')
}
//
export const getUser = () => {
	return  jwtDecoder(getToken())
}

export const setToken = (token) => {
	localStorage.setItem('token', token)
}

export const removeToken = ()=>{
	localStorage.removeItem('token')
}

export const removeTrip = ()=>{
	localStorage.removeItem('requestDetails')
}
//
// export const hasToken = () => {
// 	const token = localStorage.getItem('token')
// 	return !!token
// }
//
// export const getRole = () => {
// 	const decoded = jwtDecoder(getToken())
// 	return decoded.role
// }
//
// export const getUser = () => {
// 	return jwtDecoder(getToken())
// }
//
// export const getUsername = () => {
// 	const decoded = jwtDecoder(getToken())
// 	return decoded.username
// }
// export const getUserId = () => {
// 	const decoded = jwtDecoder(getToken())
// 	return decoded.id
// }
//
// export const getCurrentUserId = () =>{
// 	const decoded = jwtDecoder(getToken())
// 	return decoded.id
// }

export const getShortDate = (date)=>{
	return date.substring(0, 10) //?
}

export const minW = n => {
	const temp = Object.keys(bp).map(key => [key,  bp[key]])
	
	const [result] = temp.reduce((acc, [name, size]) => {
		if (n === name) return [...acc,  `@media (min-width: ${size}px)`]
		return  acc
	}, [])
	
	return result
}

export const getDistanceAndDuration = (coord1, coord2) =>{
	// const coord1
	//-84.518641,39.134270};${-84.512023,39.102779
	const key = process.env.REACT_APP_MAPBOX_TOKEN
	const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coord1[0]},${coord1[1]};${coord2[0]},${coord2[1]}?geometries=geojson&access_token=${key}`
}

export const getDuration = (duration) =>{
	const inMinutes = Math.round(duration/60)
	const inHours = Math.round(duration/60/60)
}
//
// export const setLocalStore = (key, value) =>{
// 	if (typeof value === 'string'){
// 		localStorage.setItem(key, value)
// 	}else{
// 		localStorage.setItem(key, JSON.stringify(value))
// 	}
// }
//
// export const getLocalStore = (key) => {
// 	const res = localStorage.getItem(key)
// 	console.log("typeof", typeof res)
// }
//
// export const removeLocalStore = (key) =>{
// 	localStorage.removeItem(key)
// }
//
//
