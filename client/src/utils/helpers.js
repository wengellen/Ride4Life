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

