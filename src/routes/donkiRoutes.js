const express = require('express');
const router = express.Router();
const {
    getDonkiCME,
    getDonkiFLR,
    getDonkiNotifications
} = require('../services/donkiService');

// GET /donki/cme?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/cme', async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const data = await getDonkiCME({ startDate, endDate });
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// GET /donki/flr?startDate=&endDate=
router.get('/flr', async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const data = await getDonkiFLR({ startDate, endDate });
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// GET /donki/notifications?startDate=&endDate=&type=
router.get('/notifications', async (req, res, next) => {
    try {
        const { startDate, endDate, type } = req.query;
        const data = await getDonkiNotifications({ startDate, endDate, type });
        res.json(data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
