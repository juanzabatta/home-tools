import supertest from 'supertest';
import app from '../src/app';
const request = supertest(app);

describe('Test config jest', () => {
	it('expect true === true', () => {
		expect(true).toBe(true);
	});
});

describe('Test server', () => {
	it('Test server', async (done) => {
		const response = await request.get('/');

		expect(response.status).toBe(200);
		done();
	});
});
