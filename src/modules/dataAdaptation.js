import bcrypt from 'bcrypt';

module.exports = async function (params) {
	let body = {};
	const saltRounds = 10;

	if (params.firstName && params.firstName.trim()) {
		body.firstName = specialCharacterReplacement(params.firstName);
	}

	if (params.lastName && params.lastName.trim()) {
		body.lastName = specialCharacterReplacement(params.lastName);
	}

	if (params.email && params.email.trim() && params.email.trim().length > 4) {
		body.email = specialCharacterReplacement(params.email);
	}

	if (
		params.phone &&
		params.phone.length !== 9 &&
		typeof params.phone === 'number'
	) {
		body.phone = params.phone;
	}

	if (
		params.password &&
		params.password.trim() &&
		params.password.trim().length >= 6
	) {
		params.password = specialCharacterReplacement(params.password);
		body.password = params.password;
		body.passwordEncript = await bcrypt.hashSync(params.password, saltRounds);
	}

	if (params.active !== undefined && typeof params.active === 'boolean') {
		body.active = params.active;
	}

	if (
		params.emailNotifications !== undefined &&
		typeof params.emailNotifications === 'boolean'
	) {
		body.emailNotifications = params.emailNotifications;
	}

	if (
		params.emailVerificated !== undefined &&
		typeof params.emailVerificated === 'boolean'
	) {
		body.emailVerificated = params.emailVerificated;
	}

	return body;
};

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
