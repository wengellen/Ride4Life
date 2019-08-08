import axios from 'axios'

// const dev = process.env.NODE_ENV !== "production"
const BASE_URL = process.env.NODE_ENV !== "production" ? "http://localhost:7000" : "https://ride4lifer.herokuapp.com/"
console.log('process.env.NODE_ENV', process.env.NODE_ENV)
export const API =
				 axios.create({
					baseURL:BASE_URL,
					timeout:60000,
					headers:{
						'Content-Type':'application/json',
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				})
//
