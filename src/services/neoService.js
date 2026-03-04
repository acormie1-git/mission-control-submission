const { nasaHttp } = require('../lib/httpClient');
const { HttpError, upstreamError } = require('../lib/error');

const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

// Feed: GET /neo/rest/v1/feed
async function getNeoFeed({ start_date, end_date }) {
    if (!start_date) {
        throw new HttpError(400, 'BAD_REQUEST', 'start_date is required');
    }

    const params = {
        api_key: API_KEY,
        start_date,
        end_date
    };

    try {
        const res = await nasaHttp.get('https://api.nasa.gov/neo/rest/v1/feed', {
            params
        });
        return res.data;
    } catch (err) {
        throw upstreamError(
            err.response?.status,
            `Failed to call NeoWs feed: ${err.message}`
        );
    }
}

// Lookup: GET /neo/rest/v1/neo/{id}
async function getNeoById(id) {
    if (!id) {
        throw new HttpError(400, 'BAD_REQUEST', 'asteroid_id is required');
    }

    const params = { api_key: API_KEY };

    try {
        const res = await nasaHttp.get(
            `https://api.nasa.gov/neo/rest/v1/neo/${encodeURIComponent(id)}`,
            { params }
        );
        return res.data;
    } catch (err) {
        throw upstreamError(
            err.response?.status,
            `Failed to call NeoWs lookup: ${err.message}`
        );
    }
}

// Browse: GET /neo/rest/v1/neo/browse
async function browseNeo({ page, size } = {}) {
    const params = {
        api_key: API_KEY
    };

    if (typeof page !== 'undefined') params.page = page;
    if (typeof size !== 'undefined') params.size = size;

    try {
        const res = await nasaHttp.get(
            'https://api.nasa.gov/neo/rest/v1/neo/browse',
            { params }
        );
        return res.data;
    } catch (err) {
        throw upstreamError(
            err.response?.status,
            `Failed to call NeoWs browse: ${err.message}`
        );
    }
}

module.exports = {
    getNeoFeed,
    getNeoById,
    browseNeo
};
