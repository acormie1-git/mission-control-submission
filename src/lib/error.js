class HttpError extends Error {
    constructor(statusCode, code, message) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}

const upstreamError = (statusCode, message, code = 'NASA_UPSTREAM_ERROR') =>
    new HttpError(statusCode || 502, code, message || 'Upstream NASA API error');

module.exports = { HttpError, upstreamError };