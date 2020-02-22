import jwtDecoder from 'jwt-decode'

const bp = {
	smaller: 321,
	small: 501,
	large: 1201,
};

export const getToken = () => {
	return localStorage.getItem('token')
}

export const parseToken = () => {
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

export const hasToken = () => {
	const token = localStorage.getItem('token')
	return !!token
}

export const getRole = () => {
	const decoded = jwtDecoder(getToken())
	return decoded.role
}

export const getUsername = () => {
	const decoded = jwtDecoder(getToken())
	return decoded.username
}

export const getCurrentUserId = () =>{
	const decoded = jwtDecoder(getToken())
	return decoded.id
}

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

export const setLocalStore = (key, value) =>{
	if (typeof value === 'string'){
		localStorage.setItem(key, value)
	}else{
		localStorage.setItem(key, JSON.stringify(value))
	}
}

export const getLocalStore = (key) => {
	// console.log("getLocalStore - key",key)
	const res = localStorage.getItem(key)
	// console.log("getLocalStore - res",res)
	console.log("typeof", typeof res)
	// return JSON.parse(localStorage.getItem(key))
	// if (typeof res === 'object'){
	// 	console.log("getLocalStore - res",res)
	// 	return JSON.parse(localStorage.getItem('user'))
	// 	// return JSON.parse(res)
	// }else{
	// 	// console.log("getLocalStore -res",JSON.parse(res))
	// 	return res
	// }
}

export const removeLocalStore = (key) =>{
	localStorage.removeItem(key)
}
