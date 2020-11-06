import supertest from 'supertest';
import app from '../src/app';

let request = supertest(app),
	userTest = {
		firstName: 'test nombre',
		lastName: 'test apellido',
		email: 'test@test.com',
		password: '123456789',
		phone: 123456789,
		active: true,
	},
	userTest2 = {
		firstName: 'test nombre 2',
		lastName: 'test apellido 2',
		email: 'test@test.com',
		password: '987654321',
		phone: 987654321,
		active: false,
		emailNotification: false,
	},
	token;

describe('Register user', () => {
	it('Should register successful', async (done) => {
		const response = await request.post('/api/user/register').send(userTest);

		expect(response.status).toBe(200);
		expect(Boolean(response.body.token)).toStrictEqual(true);
		expect(typeof response.body.token).toStrictEqual('string');
		done();
	});

	it('Should not register user, email already in used', async (done) => {
		const response = await request.post('/api/user/register').send(userTest);

		expect(response.status).toBe(400);
		expect(response.body).toStrictEqual({
			message: 'Email is already in use.',
		});
		done();
	});

	it('Should not register user, the request data is empty', async (done) => {
		const response = await request.post('/api/user/register').send({});
		expect(response.status).toBe(400);
		done();
	});
});

describe('Login user', () => {
	it('Should login successful', async (done) => {
		const response = await request.post('/api/user/login').send(userTest);
		token = response.body.token;
		expect(response.status).toBe(200);
		expect(Boolean(response.body.token)).toStrictEqual(true);
		expect(typeof response.body.token).toStrictEqual('string');
		done();
	});

	it('Should not login, the request data is empty', async (done) => {
		const response = await request.post('/api/user/login').send({});

		expect(response.status).toBe(400);
		done();
	});

	it('Should not login, user not found', async (done) => {
		const response = await request
			.post('/api/user/login')
			.send({ email: 'test2@test.test', password: '1234567890' });

		expect(response.status).toBe(404);
		done();
	});

	it('Should not login, incorrect password', async (done) => {
		const response = await request
			.post('/api/user/login')
			.send({ email: 'test@test.com', password: '123456789x' });

		expect(response.status).toBe(400);
		expect(response.body).toStrictEqual({
			message: 'Incorrect password.',
			remainingPoints: expect.any(Number),
		});
		done();
	});
});

describe('Update user', () => {
	it('Should update successful', async (done) => {
		const response = await request
			.put('/api/user')
			.send(userTest2)
			.set({ 'Content-Type': 'application/json', token });

		token = response.body.token;
		expect(response.status).toBe(200);
		expect(Boolean(response.body.token)).toStrictEqual(true);
		expect(typeof response.body.token).toStrictEqual('string');
		done();
	});

	it('Should not update user, him unauthorized', async (done) => {
		const response = await request
			.put('/api/user')
			.send(userTest2)
			.set({ 'Content-Type': 'application/json' });

		expect(response.status).toBe(401);
		done();
	});
});

describe('Change email', () => {
	it('Should change email successful', async (done) => {
		const response = await request
			.put(`/api/user/changeEmail/`)
			.send({ email: 'juanzabatta@gmail.com' })
			.set({ 'Content-Type': 'application/json', token });

		token = response.body.token;
		expect(response.status).toBe(200);
		expect(Boolean(response.body.token)).toStrictEqual(true);
		expect(typeof response.body.token).toStrictEqual('string');
		done();
	});

	it('Should not change email, email already in used', async (done) => {
		const response = await request
			.put(`/api/user/changeEmail/`)
			.send({ email: 'test@test.cl' })
			.set({ 'Content-Type': 'application/json', token });

		expect(response.status).toBe(400);
		expect(response.body).toStrictEqual({
			message: 'Email is already in use.',
		});
		done();
	});

	it('Should not change email, empty token', async (done) => {
		const response = await request
			.put(`/api/user/changeEmail/`)
			.send({ email: 'test@test.com' })
			.set({ 'Content-Type': 'application/json', token: {} });
		expect(response.status).toBe(401);
		done();
	});
});

describe('Verify email', () => {
	it('Should verify email successful', async (done) => {
		const response = await request
			.put(`/api/user/verifyEmail/`)
			.send({ email: 'juanzabatta@gmail.com' });
		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual({ message: 'Email verified.' });
		done();
	});

	it('Should not verify the email, email incorrect', async (done) => {
		const response = await request.put(`/user/resetPassword/xxxx@xxxx.xx`);
		expect(response.status).toBe(404);
		done();
	});
});

describe('Reset password', () => {
	it('Should reset password and sent email', async (done) => {
		const response = await request
			.put(`/api/user/resetPassword/`)
			.send({ email: 'juanzabatta@gmail.com' });
		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual({
			message: 'Email sent.',
		});
		done();
	});

	it('Should not reset the password, email incorrect', async (done) => {
		const response = await request.put(`/user/resetPassword/xxxx@xxxx.xx`);
		expect(response.status).toBe(404);
		done();
	});
});

describe('Delete user', () => {
	it('Should delete successful', async (done) => {
		const response = await request
			.delete('/api/user/')
			.set({ 'Content-Type': 'application/json', token });

		expect(response.status).toBe(200);
		expect.objectContaining(userTest);
		done();
	});

	it('Should not delete user, him unauthorized', async (done) => {
		const response = await request
			.delete('/api/user/')
			.set({ 'Content-Type': 'application/json' });

		expect(response.status).toBe(401);
		done();
	});
});
