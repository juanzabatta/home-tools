import supertest from 'supertest';
import app from '../src/app';
const request = supertest(app);
let logsData;

describe('Test config jest', () => {
	it('expect true === true', () => {
		expect(true).toBe(true);
	});
});

describe('Test server', () => {
	it('Test server', async (done) => {
		const response = await request.get('/');

		console['log'] = jest.fn((inputs) => {
			logsData = inputs;
		});

		expect(response.status).toBe(200);
		// expect(logsData).toBe('All models were synchronized successfully.');
		done();
	});
});
