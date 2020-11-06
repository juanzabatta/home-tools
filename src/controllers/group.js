// import User from '../models/User';
// import Group from '../models/Group';
// import GroupUser from '../models/GroupUser';
// import bcrypt from 'bcrypt';
// import _ from 'underscore';
// import jwt from 'jsonwebtoken';
// const saltRounds = 10;

// // List group
// export async function listGroup(req, res) {
// 	const { email, password } = req.body;

// 	try {
// 		let user = await User.findOne({
// 			where: { email },
// 		});

// 		if (!user) {
// 			res.status(404).json({
// 				message: 'User not found.',
// 			});
// 		}

// 		// decrypt password and compare
// 		if (!bcrypt.compareSync(password, user.password)) {
// 			res.status(400).json({
// 				message: 'Incorrect password.',
// 			});
// 		}

// 		// Hides important properties
// 		user = _.pick(user, [
// 			'id',
// 			'firstName',
// 			'lastName',
// 			'email',
// 			'phone',
// 			'active',
// 		]);

// 		// Generate token
// 		const token = jwt.sign(
// 			{
// 				data: user,
// 			},
// 			'HT-2020-Prod',
// 			{ expiresIn: '3h' },
// 		);

// 		// Response
// 		res.json({
// 			user,
// 			token,
// 		});
// 	} catch (error) {
// 		return res.status(500).json({
// 			message: 'Something goes wrong.',
// 		});
// 	}
// }

// // Create new group
// export async function createGroup(req, res) {
// 	const { name, description } = req.body;
// 	const { id } = req.user;
// 	let code, result;
// 	const d = new Date(),
// 		date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

// 	try {
// 		const groups = await Group.findAll({
// 			where: { created: date },
// 			attributes: ['code'],
// 		});

// 		function generatePassword() {
// 			let length = 8,
// 				charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
// 				retVal = '';
// 			for (let i = 0, n = charset.length; i < length; ++i) {
// 				retVal += charset.charAt(Math.floor(Math.random() * n));
// 			}
// 			return retVal;
// 		}

// 		function generateCode() {
// 			let length = 8,
// 				charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
// 				retVal = '';
// 			for (let i = 0, n = charset.length; i < length; ++i) {
// 				retVal += charset.charAt(Math.floor(Math.random() * n));
// 			}
// 			return retVal;
// 		}

// 		function checkIfTheCodeExists() {
// 			let check = -1;

// 			if (groups) {
// 				check = groups.findIndex((group) => group === code);
// 			}
// 			return check;
// 		}

// 		do {
// 			code = generateCode();
// 			result = checkIfTheCodeExists();
// 		} while (result !== -1);

// 		const password = generatePassword();

// 		let newGroup = await Group.create({
// 			name,
// 			description,
// 			code,
// 			password,
// 			created: date,
// 		});

// 		if (newGroup) {
// 			const newGroupUser = await GroupUser.create({
// 				userId: id,
// 				groupId: newGroup.id,
// 			});

// 			if (newGroupUser) {
// 				const x = await Group.findAll({
// 					where: { id: newGroup.id },
// 					include: [
// 						{
// 							model: User,
// 							attributes: [
// 								'id',
// 								'firstName',
// 								'lastName',
// 								'email',
// 								'phone',
// 								'active',
// 							],
// 						},
// 					],
// 				});

// 				res.json({ data: x });
// 			}
// 		}
// 	} catch (error) {
// 		return res.status(500).json({
// 			message: 'Something goes wrong.',
// 		});
// 	}
// }

// // Update group
// export async function updateGroup(req, res) {
// 	const { id } = req.params;
// 	const { firstName, lastName, email, phone, password } = req.body;

// 	try {
// 		let user = await User.findOne({
// 			where: { id },
// 		});

// 		// Encrypt the password
// 		if (password) {
// 			var passwordEncript = bcrypt.hashSync(password, saltRounds);
// 		}

// 		if (user) {
// 			user = await user.update({
// 				id: user.id,
// 				firstName: firstName ? firstName : user.firstName,
// 				lastName: lastName ? lastName : user.lastName,
// 				email: email ? email : user.email,
// 				password: password ? passwordEncript : user.password,
// 				phone: phone ? phone : user.phone,
// 				active: user.active,
// 				updatedAt: Date.now(),
// 			});
// 		}

// 		// Hides important properties
// 		user = _.pick(user, [
// 			'id',
// 			'firstName',
// 			'lastName',
// 			'email',
// 			'phone',
// 			'active',
// 		]);

// 		res.json({ data: user });
// 	} catch (error) {
// 		return res.status(500).json({
// 			message: 'Something goes wrong.',
// 		});
// 	}
// }

// // Delete group
// export async function deleteGroup(req, res) {
// 	const { id } = req.params;

// 	try {
// 		let group = await Group.findOne({
// 			where: { id },
// 			include: [
// 				{
// 					model: User,
// 					attributes: [
// 						'id',
// 						'firstName',
// 						'lastName',
// 						'email',
// 						'phone',
// 						'active',
// 					],
// 				},
// 			],
// 		});

// 		if (group) {
// 			await Group.destroy({
// 				where: { id },
// 			});
// 		}

// 		res.json({ data: group });
// 	} catch (error) {
// 		return res.status(500).json({
// 			message: 'Something goes wrong.',
// 		});
// 	}
// }
