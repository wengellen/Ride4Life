import config from "../config";
import { User } from "../resources/user/user.model";
import { Rider } from "../resources/rider/rider.model";
import { Driver } from "../resources/driver/driver.model";
import jwt from "jsonwebtoken";
import {io} from "../io";

export const newToken = user => {
	return jwt.sign(
		{ id: user.id, username: user.username, role: user.role },
		config.secrets.jwt,
		{
			expiresIn: config.secrets.jwtExp
		}
	);
};

export const verifyToken = token =>
	new Promise((resolve, reject) => {
		jwt.verify(token, config.secrets.jwt, (err, payload) => {
			if (err) return reject(err);
			resolve(payload);
		});
	});

export const signup = async (req, res) => {
	let user;
	let emailFound; // = await Rider.find({ email }).exec();
	let duplicateErrorMessages = [];
	const { username, password, email, phone } = req.body;
	if (!email || !phone || !username || !password) {
		return res.status(400).send({
			error: 1,
			message: "need email, phone, username and password"
		});
	}
	// if username is taken?
	switch (req.body.role) {
		case "rider":
			user = await Rider.find({ username }).exec();
			emailFound = await Rider.find({ email }).exec();
			break;
		case "driver":
			user = await Driver.find({ username }).exec();
			emailFound = await Driver.find({ email }).exec();

			break;
		case "admin":
			user = await User.find({ username }).exec();
			emailFound = await User.find({ email }).exec();

			break;
	}
	console.log("user,", user);
	console.log("emailFound,", emailFound);

	if (user.length > 0) {
		duplicateErrorMessages.push("Username");
	}
	// if email exist
	if (emailFound.length > 0) {
		duplicateErrorMessages.push("Email");
	}

	if (duplicateErrorMessages.length > 0) {
		let count = duplicateErrorMessages.length > 1 ? "are" : "is";
		return res.status(400).json({
			error: 1,
			message: `The ${duplicateErrorMessages.join()} ${count} taken`
		});
	}

	try {
		switch (req.body.role) {
			case "rider":
				user = await Rider.create({ ...req.body });
				break;
			case "driver":
				user = await Driver.create({ ...req.body });
				break;
			case "admin":
				user = await User.create({ ...req.body });
				break;
		}

		const token = newToken(user);
		return res.status(201).json({
			message: "Signup successful",
			role: req.body.role,
			user: user
		});
	} catch (e) {
		res.status(500).json({
			error: e
		});
	}
};

export const signin = async (req, res) => {
	let doc;
	if (!req.body.username || !req.body.password) {
		return res.status(400).send({ message: "need username and password" });
	}

	const invalid = { message: "Invalid username and password combination" };

	try {
		switch (req.body.role) {
			case "rider":
				doc = Rider;
				break;
			case "driver":
				doc = Driver;
				break;
			case "admin":
				doc = User;
				break;
		}

		const user = await doc
			.findOne({ username: req.body.username })
			// .select("_id, username password role avatar")
			.exec();

		if (!user) {
			return res.status(401).json({ error: 1, ...invalid });
		}

		const match = await user.checkPassword(req.body.password);
		if (!match) {
			return res.status(401).json({ error: 1, ...invalid });
		}
		const token = newToken(user);
		return res.status(200).json({
			message: "Login successful",
			// role: req.body.role,
			// user: user,
			token
		});
	} catch (e) {
		console.error(e);
		res.status(500).json({
			error: 1,
			message: "Server Error"
		});
	}
};

export const isTokenValidAndNotConnected = async (token, socket) => {
	let payload; // id: user.id, role: user.role
	let doc;
	try {
		// IF TOKEN MATCHES SECRETS, IT"S AUTHORIZED
		payload = await verifyToken(token);
	} catch (e) {
		console.log("You are not authorized");
		return false;
	}

	switch (payload.role) {
		case "rider":
			doc = Rider;
			break;
		case "driver":
			doc = Driver;
			break;
		case "admin":
			doc = User;
			break;
	}
	// IF USER ID IS FOUND IN ${ROLE} TABLE, IT"S AUTHENTICATED
	const user = await doc
		.findById(payload.id)
		.select("-password")
		.lean()
		.exec();

	if (!user) {
		console.log("Can not be authenticated");
		return false;
	}
	return user
	
	// console.log("socket.rooms",socket.rooms)
	// console.log("connectedSocket",user.connectedSocket)
	// console.log("socket",Object.keys(socket.rooms))
	
	// if (user.connectedSocket !== null) {
	// 	socket.disconnect()
	// 	return false;
	// }
	
	// const res = await doc.findByIdAndUpdate(payload.id, {
	// 	connectedSocket: socket.id
	// }).exec();
};

export const protect = async (req, res, next) => {
	let doc;
	const bearer = req.headers.authorization;

	if (!bearer || !bearer.startsWith("Bearer ")) {
		return res.status(401).end();
	}

	const token = bearer.split("Bearer ")[1].trim();

	let payload;
	try {
		payload = await verifyToken(token);
		console.log("payload", payload);
	} catch (e) {
		return res
			.status(401)
			.json({ error: 1, message: "You are not authorized" });
	}

	switch (payload.role) {
		case "rider":
			doc = Rider;
			break;
		case "driver":
			doc = Driver;
			break;
		case "admin":
			doc = User;
			break;
	}
	const user = await doc
		.findById(payload.id)
		.select("-password")
		.lean()
		.exec();

	if (!user) {
		return res
			.status(401)
			.json({ error: 1, message: "You can't be authenticated" });
	}

	req.user = user;
	next();
};
