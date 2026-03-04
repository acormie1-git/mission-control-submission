const axios = require('axios');

const nasaHttp = axios.create({
    timeout: 5000
});

module.exports = { nasaHttp };
