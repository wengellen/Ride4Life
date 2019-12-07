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

export const setLocal = (key, value) =>{
	if (typeof value === Object){
		localStorage.setItem(key, JSON.stringify(value))
	}else{
		localStorage.setItem(key, value)
	}
}

export const getLocal = (key) =>{
	return JSON.parse(localStorage.getItem(key))
	
}

export const removeLocal = (key) =>{
	localStorage.removeItem(key)
}
