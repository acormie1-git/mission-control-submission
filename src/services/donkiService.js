const { nasaHttp } = require('../lib/httpClient');
const { HttpError, upstreamError } = require('../lib/error');

const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

async function getDonkiCME({ startDate, endDate }) {
    const params = {
        api_key: API_KEY
    };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    try {
        const res = await nasaHttp.get('https://api.nasa.gov/DONKI/CME', { params });
        return res.data;
    } catch (err) {
        throw upstreamError(
            err.response?.status,
            `Failed to call DONKI CME: ${err.message}`
        );
    }
}

async function getDonkiFLR({ startDate, endDate }) {
    const params = {
        api_key: API_KEY
    };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    try {
        const res = await nasaHttp.get('https://api.nasa.gov/DONKI/FLR', { params });
        return res.data;
    } catch (err) {
        throw upstreamError(
            err.response?.status,
            `Failed to call DONKI FLR: ${err.message}`
        );
    }
}

async function getDonkiNotifications({ startDate, endDate, type }) {
    const params = {
        api_key: API_KEY
    };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (type) params.type = type;

    try {
        const res = await nasaHttp.get(
            'https://api.nasa.gov/DONKI/notifications',
            { params }
        );
        return res.data;
    } catch (err) {
        throw upstreamError(
            err.response?.status,
            `Failed to call DONKI notifications: ${err.message}`
        );
    }
}

module.exports = {
    getDonkiCME,
    getDonkiFLR,
    getDonkiNotifications
};
