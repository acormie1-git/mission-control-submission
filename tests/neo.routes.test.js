const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/lib/httpClient', () => {
    const getMock = jest.fn();
    return {
        nasaHttp: { get: getMock }
    };
});

const { nasaHttp } = require('../src/lib/httpClient');

describe('/neo routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /neo/feed requires start_date', async () => {
        const res = await request(app)
            .get('/neo/feed')
            .expect(400);

        expect(res.body.error.code).toBe('BAD_REQUEST');
    });

    it('GET /neo/feed returns feed data', async () => {
        const fakeFeed = {
            element_count: 1,
            near_earth_objects: {}
        };
        nasaHttp.get.mockResolvedValueOnce({ data: fakeFeed });

        const res = await request(app)
            .get('/neo/feed')
            .query({ start_date: '2015-09-07', end_date: '2015-09-08' })
            .expect(200);

        expect(nasaHttp.get).toHaveBeenCalledWith(
            'https://api.nasa.gov/neo/rest/v1/feed',
            expect.objectContaining({
                params: expect.objectContaining({
                    start_date: '2015-09-07',
                    end_date: '2015-09-08',
                    api_key: expect.any(String)
                })
            })
        );
        expect(res.body).toEqual(fakeFeed);
    });

    it('GET /neo/:id returns lookup data', async () => {
        const fakeNeo = { id: '3542519', name: 'Test Asteroid' };
        nasaHttp.get.mockResolvedValueOnce({ data: fakeNeo });

        const res = await request(app)
            .get('/neo/3542519')
            .expect(200);

        expect(nasaHttp.get).toHaveBeenCalledWith(
            'https://api.nasa.gov/neo/rest/v1/neo/3542519',
            expect.objectContaining({
                params: expect.objectContaining({
                    api_key: expect.any(String)
                })
            })
        );
        expect(res.body).toEqual(fakeNeo);
    });

    it('GET /neo (browse) returns browse data', async () => {
        const fakeBrowse = { page: 0, near_earth_objects: [] };
        nasaHttp.get.mockResolvedValueOnce({ data: fakeBrowse });

        const res = await request(app)
            .get('/neo')
            .query({ page: 1, size: 10 })
            .expect(200);

        console.log('NEO test response body:', res.body);

        expect(nasaHttp.get).toHaveBeenCalledWith(
            'https://api.nasa.gov/neo/rest/v1/neo/browse',
            expect.objectContaining({
                params: expect.objectContaining({
                    page: 1,
                    size: 10,
                    api_key: expect.any(String)
                })
            })
        );
        expect(res.body).toEqual(fakeBrowse);
    });
});
