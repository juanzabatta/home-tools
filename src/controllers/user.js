import User from '../models/User';
import bcrypt from 'bcrypt';
import _ from 'underscore';
import jwt from 'jsonwebtoken';
import geoip from 'geoip-lite';
import { redisClient } from '../db/redisConnection';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import moment from 'moment';
import mailing from '../modules/mailing';
import dataAdaptation from '../modules/dataAdaptation';

// Login user
export async function login(req, res) {
	try {
		let body = await dataAdaptation(req.body);

		if (!body.email || !body.password) {
			return res.sendStatus(400);
		}

		let user = await User.findOne({
			where: { email: body.email },
		});

		if (!user) {
			return res.sendStatus(404);
		}

		const response = await loginRequestControl(user, body.password, req.ip);

		if (response.status !== 200) {
			if (response.status === 400) {
				return res.status(response.status).json({
					message: response.message,
					remainingPoints: response.remainingPoints,
				});
			} else {
				return res.status(response.status).json({
					message: 'User blocked.',
					retryAfter: moment.utc(response.retryAfter * 1000).format('HH:mm:ss'),
				});
			}
		}

		const ip = req.ip || req.ips;
		const geo = await geoip.lookup(ip);
		if (geo && emailNotifications) {
			const params = {
				email: user.email,
				geo,
				ip,
			};
			const response = await mailing('login', params);
			if (response === 'Error') {
				return res.sendStatus(500);
			}
		}

		user = hidesImportanPropierties(user);
		const token = generateToken(user);

		return res.json({
			token,
		});
	} catch (error) {
		return res.sendStatus(500);
	}
}

// Register new user
export async function register(req, res) {
	let body;
	try {
		body = await dataAdaptation(req.body);

		if (
			!body.firstName ||
			!body.lastName ||
			!body.email ||
			!body.phone ||
			!body.password
		) {
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
			newUser = hidesImportanPropierties(newUser);
			const token = generateToken(newUser);

			return res.json({
				token,
			});
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
			return res.sendStatus(500).end();
		}
	}
}

// Update user
export async function updateUser(req, res) {
	const { id } = req.user;

	try {
		let body = await dataAdaptation(req.body);

		let user = await User.findByPk(id);

		if (!user) {
			return res.sendStatus(404);
		}

		user = await user.update({
			firstName: body.firstName || user.firstName,
			lastName: body.lastName || user.lastName,
			email: user.email,
			password: body.passwordEncript || user.password,
			phone: body.phone || user.phone,
			active: body.active !== undefined ? body.active : user.active,
			emailNotifications:
				body.emailNotifications !== undefined
					? body.emailNotifications
					: user.emailNotifications,
		});

		user = hidesImportanPropierties(user);
		const token = generateToken(user);

		return res.json({
			token,
		});
	} catch (error) {
		return res.sendStatus(500).end();
	}
}

// Change email
export async function changeEmail(req, res) {
	const { id } = req.user;
	let body;
	try {
		body = await dataAdaptation(req.body);
		if (!body.email) {
			return res.sendStatus(400);
		}

		let user = await User.findByPk(id);

		if (!user) {
			return res.sendStatus(404);
		}

		let usersChanged = await User.update(
			{
				email: body.email,
				emailVerificated: false,
			},
			{ where: { id } },
		);

		if (!usersChanged[0]) {
			return res.sendStatus(404);
		}

		user.email = body.email;
		user.emailVerificated = false;
		user = hidesImportanPropierties(user);
		const token = generateToken(user);

		return res.json({
			token,
		});
	} catch (error) {
		const registerError = await User.findOne({
			where: { email: body.email },
		});

		if (registerError) {
			return res.status(400).json({
				message: 'Email is already in use.',
			});
		} else {
			return res.sendStatus(500).end();
		}
	}
}

// Reset password
export async function resetPassword(req, res) {
	try {
		const request = {
			email: req.body.email,
			password: generatePassword(),
		};

		const body = await dataAdaptation(request);
		if (!body.email || !body.password) {
			return res.sendStatus(400);
		}

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

		const params = {
			email: body.email,
			password: body.password,
		};

		const response = await mailing('resert password', params);

		if (response === 'Error') {
			return res.sendStatus(500);
		} else {
			return res.json({ message: 'Email sent.' });
		}
	} catch (error) {
		return res.sendStatus(500).end();
	}
}

// Verify email
export async function verifyEmail(req, res) {
	try {
		const request = {
			email: req.body.email,
		};

		const body = await dataAdaptation(request);
		if (!body.email) {
			return res.sendStatus(400);
		}

		let user = await User.update(
			{ emailVerificated: true },
			{
				where: {
					email: body.email,
				},
			},
		);

		if (!user[0]) {
			return res.sendStatus(404);
		}

		return res.json({ message: 'Email verified.' });
	} catch (error) {
		return res.sendStatus(500).end();
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

		user = hidesImportanPropierties(user);

		res.json({ user });
	} catch (error) {
		return res.sendStatus(500).end();
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
		return res.sendStatus(500).end();
	}
}

function hidesImportanPropierties(user) {
	return (user = _.pick(user, [
		'id',
		'firstName',
		'lastName',
		'email',
		'phone',
		'active',
		'emailNotifications',
		'emailVerificated',
	]));
}

function generatePassword() {
	let length = 10,
		charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
		retVal = '';
	for (let i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
}

function generateToken(user) {
	return jwt.sign(
		{
			data: user,
		},
		'HT-2020-Prod',
		{ expiresIn: '3h' },
	);
}

async function loginRequestControl(user, password, ipAddr) {
	const maxWrongAttemptsByIPperDay = 10;
	const maxConsecutiveFailsByUsernameAndIP = 5;

	const limiterSlowBruteByIP = new RateLimiterRedis({
		storeClient: redisClient,
		keyPrefix: 'login_fail_ip_per_day',
		points: maxWrongAttemptsByIPperDay,
		duration: 60 * 60 * 24,
		blockDuration: 60 * 60 * 24,
	});

	const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
		storeClient: redisClient,
		keyPrefix: 'login_fail_consecutive_username_and_ip',
		points: maxConsecutiveFailsByUsernameAndIP,
		duration: 60 * 60 * 24,
		blockDuration: 60 * 60 * 24,
	});

	const usernameIPkey = `${user.email}_${ipAddr}`;

	const [resUsernameAndIP, resSlowByIP] = await Promise.all([
		limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
		limiterSlowBruteByIP.get(ipAddr),
	]);

	let retrySecs = 0;

	// Check if IP or Username + IP is already blocked
	if (
		resSlowByIP !== null &&
		resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
	) {
		retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
	} else if (
		resUsernameAndIP !== null &&
		resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP
	) {
		retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
	}

	if (retrySecs > 0) {
		return {
			status: 429,
			retryAfter: retrySecs,
		};
	} else {
		if (!bcrypt.compareSync(password, user.password)) {
			try {
				const limiterByIp = await limiterSlowBruteByIP.consume(ipAddr);
				const limiterByUser = await limiterConsecutiveFailsByUsernameAndIP.consume(
					usernameIPkey,
				);

				return {
					status: 400,
					message: 'Incorrect password.',
					remainingPoints:
						limiterByUser.remainingPoints < limiterByIp.remainingPoints
							? limiterByUser.remainingPoints
							: limiterByIp.remainingPoints,
				};
			} catch (rlRejected) {
				if (rlRejected instanceof Error) {
					throw rlRejected;
				} else {
					const secs = rlRejected.msBeforeNext / 1000 || 1;
					return {
						status: 429,
						retryAfter: secs,
					};
				}
			}
		} else {
			if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
				await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
			}

			return {
				status: 200,
			};
		}
	}
}
