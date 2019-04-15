import axios from 'axios'

export default function (){
	const token = localStorage.getItem('token')
	return axios.create({
		baseURL:'http://localhost:5000/api',
		timeout:80000,
		headers:{
			'Content-Type':'application/json',
			'Authorization': token
		}
	})
}
