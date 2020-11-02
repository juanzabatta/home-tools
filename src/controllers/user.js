import User from '../models/User';
import bcrypt from 'bcrypt';
import _ from 'underscore';
import jwt from 'jsonwebtoken';
const saltRounds = 10;
import nodemailer from 'nodemailer';
import geoip from 'geoip-lite';
import IPData from 'ipdata';

// Login user
export async function login(req, res) {
	try {
		let body = validator(req.body);

		if (!body.email || !body.password) {
			return res.sendStatus(400);
		}

		let user = await User.findOne({
			where: { email: body.email },
		});

		if (!user) {
			return res.sendStatus(404);
		}

		// decrypt password and compare
		if (!bcrypt.compareSync(body.password, user.password)) {
			return res.status(400).json({
				message: 'Incorrect password.',
			});
		}

		// Hides important properties
		user = _.pick(user, [
			'id',
			'firstName',
			'lastName',
			'email',
			'phone',
			'active',
		]);

		// Generate token
		const token = jwt.sign(
			{
				data: user,
			},
			'HT-2020-Prod',
			{ expiresIn: '3h' },
		);

		// Response
		return res.json({
			token,
		});
	} catch (error) {
		return res.sendStatus(500);
	}
}

// Register new user
export async function register(req, res) {
	let body = validator(req.body);

	try {    
		if (!body.firstName || !body.lastName || !body.email || !body.password) {
			return res.sendStatus(400);
		}

		let newUser = await User.create({
			firstName: body.firstName,
			lastName: body.lastName,
			email: body.email,
			phone: body.phone,
			password: body.passwordEncript,
		});

		if (newUser) {
			// Hides important properties
			newUser = _.pick(newUser, [
				'id',
				'firstName',
				'lastName',
				'email',
				'phone',
				'active',
			]);

			// Response
			return res.json({ newUser });
		}
	} catch (error) {
		const registerError = await User.findOne({
			where: { email: body.email },
		});

		if (registerError) {
			return res.status(400).json({
				message: 'Email is already in use.',
			});
		} else {
			return res.sendStatus(500);
		}
	}
}

// Update user
export async function updateUser(req, res) {
	const { id } = req.user;

	try {
		let body = validator(req.body);

		let user = await User.findByPk(id);

		if (user) {
			user = await user.update({
				firstName: body.firstName ? body.firstName : user.firstName,
				lastName: body.lastName ? body.lastName : user.lastName,
				email: body.email ? body.email : user.email,
				password: body.passwordEncript ? body.passwordEncript : user.password,
				phone: body.phone ? body.phone : user.phone,
				active: body.active !== undefined ? body.active : user.active,
			});
		}

		// Hides important properties
		user = _.pick(user, [
			'id',
			'firstName',
			'lastName',
			'email',
			'phone',
			'active',
		]);

		res.json({ user });
	} catch (error) {
		return res.sendStatus(500);
	}
}

// Delete user
export async function deleteUser(req, res) {
	const { id } = req.user;

	try {
		let user = await User.findByPk(id);

		if (user) {
			await User.destroy({
				where: { id },
			});
		}

		// Hides important properties
		user = _.pick(user, [
			'id',
			'firstName',
			'lastName',
			'email',
			'phone',
			'active',
		]);

		res.json({ user });
	} catch (error) {
		return res.sendStatus(500);
	}
}

// Delete user Master
export async function deleteUserMaster(req, res) {
	const { id } = req.params;

	try {
		let user = await User.findByPk(id);

		if (user) {
			await User.destroy({
				where: { id },
			});
		}

		res.json({ user });
	} catch (error) {
		return res.sendStatus(500);
	}
}

// Reset password
export async function resetPassword(req, res) {
	try {
		const request = {
			email: req.params.email,
			password: generatePassword(),
		};

		const body = validator(request);

		let user = await User.update(
			{ password: body.passwordEncript },
			{
				where: {
					email: body.email,
				},
			},
		);

		if (!user[0]) {
			return res.sendStatus(404);
		}

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'contactozabax@gmail.com',
				pass: 'zabatta96',
			},
		});
		const subject = 'Reinicio de contraseña | Home-tools';
		const text = `Ha solicitado un reinicio de contraseña, su contraseña actual es: ${body.password} , por favor cambie su contraseña.`;
		const html = `<p>Ha solicitado un reinicio de contraseña, su contraseña actual es: ${body.password} , por favor cambie su contraseña.</p>`;
		const mailOptions = {
			from: 'contactozabax@gmail.com',
			to: body.email,
			subject,
			text,
			html,
		};

		await transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				return res.sendStatus(500);
			} else {
				return res.json({ message: 'Email sent.' });
			}
		});
	} catch (error) {
		return res.sendStatus(500);
	}
}

export async function test(req, res) {
  const ipdata = new IPData('ccf58ee0519a5e84f1226d2969d05ccbf04850085182a4b72b33e977');
  var ip = req.ip
  var geo2 = await ipdata.lookup(ip)
  var geo = await geoip.lookup(ip);

  console.log(ip);
  console.log(geo);
  console.log(geo2);

if (geo) {
  
  console.log(req.ip, `${geo.country} - ${geo.region} - ${geo.city}` );
}
}

function validator(req) {
  let body = {};
  
	if (req.firstName && req.firstName.trim()) {
		body.firstName = specialCharacterReplacement(req.firstName);
  }
  
	if (req.lastName && req.lastName.trim()) {
		body.lastName = specialCharacterReplacement(req.lastName);
  }
  
	if (req.email && req.email.trim() && req.email.trim().length > 4) {
		body.email = specialCharacterReplacement(req.email);
  }
  
	if (req.phone && req.phone.length !== 9 && typeof req.phone === 'number') {
		body.phone = req.phone;
  }
  
	if (req.password && req.password.trim() && req.password.trim().length > 4) {
		req.password = specialCharacterReplacement(req.password);
		body.password = req.password;
		body.passwordEncript = bcrypt.hashSync(req.password, saltRounds);
  }
  
	if (req.active !== undefined && typeof req.active === 'boolean') {
		body.active = req.active;
  }
  
	return body;
}

function generatePassword() {
	let length = 8,
		charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
		retVal = '';
	for (let i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
}

function specialCharacterReplacement(str) {
	const charactersInvalid = [
		{ char: '<', code: '60 ' },
		{ char: '>', code: '62 ' },
		{ char: '"', code: '34 ' },
		{ char: "'", code: '39 ' },
	];

	charactersInvalid.forEach((characterInvalid) => {
		let re = new RegExp(characterInvalid.char, 'g');

		str = str.replace(re, characterInvalid.code);
	});

	return str.trim();
}
