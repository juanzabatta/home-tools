import supertest from 'supertest';
import app from '../src/app';
const request = supertest(app);
let userTest = {
	firstName: 'test nombre',
	lastName: 'test apellido',
	email: 'test@test.test',
	password: '123456789',
	phone: 123456789,
	active: true,
};
let userTest2 = {
	firstName: 'test nombre 2',
	lastName: 'test apellido 2',
	email: 'contactozabax@gmail.com',
	password: '987654321',
	phone: 987654321,
	active: false,
};
let token;

describe('Register user', () => {
	it('Should register successful', async (done) => {
		const response = await request.post('/api/user/register').send(userTest);
		userTest.id = response.body.newUser.id;
		response.body.newUser.password = userTest.password;
		expect(response.status).toBe(200);
		expect(response.body.newUser).toStrictEqual(userTest);
		done();
	});

	it('Should not register user, email already is used', async (done) => {
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
			.send({ email: 'test@test.test', password: '123456789x' });

		expect(response.status).toBe(400);
		expect(response.body).toStrictEqual({
			message: 'Incorrect password.',
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
		userTest2.id = response.body.user.id;
		response.body.user.password = userTest2.password;

		expect(response.status).toBe(200);
		expect(typeof response.body.user).toStrictEqual('object');
		expect(response.body.user).toStrictEqual(userTest2);
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

	it('Should not update user, the request data is empty', async (done) => {
		const response = await request
			.put('/api/user')
			.send({})
			.set({ 'Content-Type': 'application/json', token });
		response.body.user.password = userTest2.password;

		expect(response.status).toBe(200);
		expect(typeof response.body.user).toStrictEqual('object');
		expect(response.body.user).toStrictEqual(userTest2);
		done();
	});
});

describe('Reset password', () => {
	it('Should reset password and sent email', async (done) => {
		const response = await request.put(
			`/api/user/resetPassword/${userTest2.email}`,
		);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
			message: 'Email sent.',
		});
		done();
  });
  
  it('Should not reset the password, email incorrect', async(done)=>{
    const response = await request.put(
			`/user/resetPassword/xxxx@xxxx.xx`,
		);
    expect(response.status).toBe(404);
		done();
  })
});

describe('Delete user', () => {
	it('Should delete successful', async (done) => {
		const response = await request
			.delete('/api/user/')
			.set({ 'Content-Type': 'application/json', token });
		response.body.user.password = userTest2.password;

		expect(response.status).toBe(200);
		expect(response.body.user).toStrictEqual(userTest2);
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
