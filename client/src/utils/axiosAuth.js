import axios from 'axios'
import {getLocalStore} from "./helpers";

const BASE_URL = process.env.NODE_ENV !== "production" ? "http://localhost:7000" : "https://ride4lifer.herokuapp.com/"
console.log('process.env.NODE_ENV', process.env.NODE_ENV)

export default function (){
	const token = `Bearer ${localStorage.getItem('token')}`
	return axios.create({
		baseURL:BASE_URL,
		timeout:80000,
		headers:{
			'Content-Type':'application/json',
			'Authorization': token
		}
	})
}

