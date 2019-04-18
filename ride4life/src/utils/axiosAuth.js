import axios from 'axios'

const dev = false
const BASE_URL = dev ? "http://localhost:4500/api" : "https://ride-for-life.herokuapp.com"

// export default function (){
const token = localStorage.getItem('token') || '' //Math.random().toString(16).substring(-8)
export const API =
				 axios.create({
					baseURL:"https://ride-for-life.herokuapp.com",
					timeout:60000,
					headers:{
						'Content-Type':'application/json',
						'Authorization': localStorage.getItem('token')
					}
				})
//
