import axios from 'axios'
const BASE_URL = "https://ride-for-life.herokuapp.com/api"

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
