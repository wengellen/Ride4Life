import config from '../config'
import { User } from '../resources/trip/trip.model'
import { Rider } from '../resources/rider/rider.model'
import { Driver } from '../resources/driver/driver.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
	console.log('user',user)
	return jwt.sign({ id: user.id, role: user.role }, config.secrets.jwt, {
		expiresIn: config.secrets.jwtExp
	})
}

export const verifyToken = token =>
	new Promise((resolve, reject) => {
		jwt.verify(token, config.secrets.jwt, (err, payload) => {
			
			if (err) return reject(err)
			resolve(payload)
		})
	})

export const signup = async (req, res) => {
	let user
	if (!req.body.email || !req.body.phone ||  !req.body.username || !req.body.password) {
		return res.status(400).send({ message: 'need email, phone, username and password' })
	}

	try {
		if (req.body.role === 'rider'){
			user = await Rider.create({...req.body})
			// trip.rider= rider._id
		}else{
			user = await Driver.create({...req.body})
		}
		
		const token = newToken(user)
		return res.status(201).send({ token })
	} catch (e) {
		console.log('error',e)
		res.status(500).send(e)
	}
}

export const signin = async (req, res) => {
	if (!req.body.username || !req.body.password) {
		return res.status(400).send({ message: 'need username and password' })
	}
	
	const invalid = { message: 'Invalid username and password combination' }
	
	try {
		    let doc = req.body.role  === 'rider' ? Rider : Driver
			const user = await doc.findOne({ username: req.body.username })
			.select('username password role')
			.exec()
			
			if (!user) {
				return res.status(401).send(invalid)
			}
			
			const match = await user.checkPassword(req.body.password)
			if (!match) {
				return res.status(401).send(invalid)
			}
			const token = newToken(user)
			return res.status(200).json({
				message: "Login successful",
				role: req.body.role,
				user: user.username,
				token,
			});
		
	} catch (e) {
		console.error(e)
		res.status(500).send(e)
	}
}

export const protect = async (req, res, next) => {
	const bearer = req.headers.authorization
	
	if (!bearer || !bearer.startsWith('Bearer ')) {
		return res.status(401).end()
	}
	
	const token = bearer.split('Bearer ')[1].trim()
	let payload
	try {
		payload = await verifyToken(token)
	} catch (e) {
		return res.status(401).end()
	}
	
	let doc = payload.role === 'rider' ? Rider : Driver
	const user = await doc.findById(payload.id)
	.select('-password')
	.lean()
	.exec()

	if (!user) {
		return res.status(401).end()
	}
	
	req.user = user
	next()
}
