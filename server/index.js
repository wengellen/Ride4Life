const express = require('express')
const db = require('./data/db')

const server = express()
server.use(express.json())

server.get('/', (req, res) => {
	res.send('It is alive')
})

server.get('/hubs', (req, res) => {
	db.hubs
		.find()
		.then((result) => {
			res.status(200).json(result)
		})
		.catch((err) =>
			res.json({error: err, message: "something broke"})
		)
})

server.post('/hubs', (req, res) => {
	const bodyInfo = req.body
	console.log(bodyInfo)
	db.hubs
	.add(bodyInfo)
	.then((result) => {
		res.status(201).json(result)
	})
	.catch((err) =>
		res.state(500).json({error: err, message: "something broke"})
	)
})


server.listen(4000, ()=> {
	console.log('*** listening on port 4000 ***')
})
