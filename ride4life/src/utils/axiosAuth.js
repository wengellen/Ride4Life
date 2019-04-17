import axios from 'axios'

const dev = false
const BASE_URL = dev ? "http://localhost:4500/api" : "https://ride-for-life.herokuapp.com/api"

export default function (){
	const token = localStorage.getItem('token') || Math.random().toString(16).substring(-8)
	return axios.create({
		baseURL:BASE_URL,
		timeout:3000,
		headers:{
			// 'Content-Type':'application/json',
			'Authorization': token
		}
	})
}
