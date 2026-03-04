const express = require('express');
const router = express.Router();
const { getApod } = require('../services/apodService');

router.get('/', async (req, res, next) => {
    try {
        const { date, start_date, end_date, count, thumbs } = req.query;

        const options = {
            date,
            start_date,
            end_date,
            count: count ? Number(count) : undefined,
            thumbs: thumbs === 'true'
        };

        const data = await getApod(options);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
