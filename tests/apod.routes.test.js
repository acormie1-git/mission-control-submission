// tests/apod.routes.test.js
const request = require('supertest');
const app = require('../src/app');
const { nasaHttp } = require('../src/lib/httpClient');

jest.mock('../src/lib/httpClient', () => {
    const getMock = jest.fn();
    return {
        nasaHttp: { get: getMock }
    };
});

describe('/apod', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns APOD data for a given date', async () => {
        const fakeData = { date: '2024-01-01', title: 'Test APOD' };
        nasaHttp.get.mockResolvedValueOnce({ data: fakeData });

        const res = await request(app)
            .get('/apod')
            .query({ date: '2024-01-01' })
            .expect(200);
        console.log('APOD test response body:', res.body);
        expect(res.body).toEqual(fakeData);
        expect(nasaHttp.get).toHaveBeenCalled();
    });
});
