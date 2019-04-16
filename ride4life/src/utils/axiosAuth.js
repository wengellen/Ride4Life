import axios from 'axios'
const BASE_URL = "http://localhost:5000|| ''"

export default function (){
	const token = localStorage.getItem('token')
	return axios.create({
		baseURL:BASE_URL,
		timeout:3000,
		headers:{
			'Content-Type':'application/json',
			'Authorization': token
		}
	})
}
