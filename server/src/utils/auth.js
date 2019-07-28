import config from '../config'
import { User } from '../resources/trip/trip.model'
import { Rider } from '../resources/rider/rider.model'
import { Driver } from '../resources/driver/driver.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
	return jwt.sign({ id: user.id }, config.secrets.jwt, {
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
		res.status(500).json(error)
	}
}

export const signin = async (req, res) => {
	console.log("req",req)
	if (!req.body.username || !req.body.password) {
		return res.status(400).send({ message: 'need username and password' })
	}
	
	const invalid = { message: 'Invalid username and passoword combination' }
	
	try {
		if (req.body.role === 'rider'){
			const rider = await Rider.findOne({ username: req.body.username })
			.select('username password')
			.exec()
			
			if (!rider) {
				return res.status(401).send(invalid)
			}
			
			const match = await rider.checkPassword(req.body.password)
			if (!match) {
				return res.status(401).send(invalid)
			}
			const token = newToken(rider)
			return res.status(200).json({
				message: "Login successful",
				role:'rider',
				user: rider.username,
				token,
			});
		}else{
			const driver = await Driver.findOne({ username: req.body.username })
			.select('username password')
			.exec()
			if (!driver) {
				return res.status(401).send(invalid)
			}
			
			const match = await driver.checkPassword(req.body.password)
			if (!match) {
				return res.status(401).send(invalid)
			}
			const token = newToken(driver)
			return res.status(200).json({
				message: "Login successful",
				role:'rider',
				user: driver.username,
				token,
			});
		}
		
	} catch (e) {
		console.error(e)
		res.status(500).json(error)
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
	
	const user = await User.findById(payload.id)
	.select('-password')
	.lean()
	.exec()
	
	if (!user) {
		return res.status(401).end()
	}
	
	req.user = user
	next()
}
