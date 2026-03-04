const { nasaHttp } = require('../lib/httpClient');
const { HttpError, upstreamError } = require('../lib/error');

const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

// Wraps GET https://api.nasa.gov/planetary/apod
async function getApod(options = {}) {
    const { date, start_date, end_date, count, thumbs } = options;

    // Basic validation (don’t allow conflicting params)
    if (count && (date || start_date || end_date)) {
        throw new HttpError(
            400,
            'BAD_REQUEST',
            'count cannot be used with date or start_date/end_date'
        );
    }

    const params = {
        api_key: API_KEY
    };

    if (date) params.date = date;
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;
    if (typeof count !== 'undefined') params.count = count;
    if (typeof thumbs !== 'undefined') params.thumbs = thumbs;

    try {
        const res = await nasaHttp.get('https://api.nasa.gov/planetary/apod', {
            params
        });
        return res.data; // NASA returns an object or array depending on params[web:4][web:10]
    } catch (err) {
        throw upstreamError(
            err.response?.status,
            `Failed to call APOD: ${err.message}`
        );
    }
}

module.exports = { getApod };
