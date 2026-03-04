const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/lib/httpClient', () => {
    const getMock = jest.fn();
    return {
        nasaHttp: { get: getMock }
    };
});

const { nasaHttp } = require('../src/lib/httpClient');

describe('/donki routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /donki/cme returns CME data', async () => {
        const fakeCME = [{ activityID: 'TEST_CME' }];
        nasaHttp.get.mockResolvedValueOnce({ data: fakeCME });

        const res = await request(app)
            .get('/donki/cme')
            .query({ startDate: '2017-01-03', endDate: '2017-01-03' })
            .expect(200);

        expect(nasaHttp.get).toHaveBeenCalledWith(
            'https://api.nasa.gov/DONKI/CME',
            expect.objectContaining({
                params: expect.objectContaining({
                    startDate: '2017-01-03',
                    endDate: '2017-01-03',
                    api_key: expect.any(String)
                })
            })
        );
        expect(res.body).toEqual(fakeCME);
    });

    it('GET /donki/flr returns FLR data', async () => {
        const fakeFLR = [{ flrID: 'TEST_FLR' }];
        nasaHttp.get.mockResolvedValueOnce({ data: fakeFLR });

        const res = await request(app)
            .get('/donki/flr')
            .query({ startDate: '2016-01-01', endDate: '2016-01-30' })
            .expect(200);

        expect(nasaHttp.get).toHaveBeenCalledWith(
            'https://api.nasa.gov/DONKI/FLR',
            expect.objectContaining({
                params: expect.objectContaining({
                    startDate: '2016-01-01',
                    endDate: '2016-01-30',
                    api_key: expect.any(String)
                })
            })
        );
        expect(res.body).toEqual(fakeFLR);
    });

    it('GET /donki/notifications returns notifications data', async () => {
        const fakeNotifs = [{ messageType: 'Report', messageID: 'TEST_NOTIF' }];
        nasaHttp.get.mockResolvedValueOnce({ data: fakeNotifs });

        const res = await request(app)
            .get('/donki/notifications')
            .query({
                startDate: '2014-05-01',
                endDate: '2014-05-08',
                type: 'all'
            })
            .expect(200);
        console.log('DONKI test response body:', res.body);

        expect(nasaHttp.get).toHaveBeenCalledWith(
            'https://api.nasa.gov/DONKI/notifications',
            expect.objectContaining({
                params: expect.objectContaining({
                    startDate: '2014-05-01',
                    endDate: '2014-05-08',
                    type: 'all',
                    api_key: expect.any(String)
                })
            })
        );
        expect(res.body).toEqual(fakeNotifs);
    });
});
