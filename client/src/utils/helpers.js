const bp = {
	smaller: 321,
	small: 501,
	large: 1201,

};

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
	const res = localStorage.getItem(key)
	if (typeof res === 'string'){
		return res
	}else{
		return JSON.parse(res)
	}
}

export const removeLocalStore = (key) =>{
	localStorage.removeItem(key)
}
