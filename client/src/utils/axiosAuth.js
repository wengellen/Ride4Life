import axios from 'axios'

const dev = true
const BASE_URL = dev ? "http://localhost:7000" : "https://ride-for-life.herokuapp.com"

// export default function (){
// const token = localStorage.getItem('token') || '' //Math.random().toString(16).substring(-8)
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
