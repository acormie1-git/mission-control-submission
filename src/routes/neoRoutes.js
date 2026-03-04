const express = require('express');
const router = express.Router();
const {
    getNeoFeed,
    getNeoById,
    browseNeo
} = require('../services/neoService');

// GET /neo/feed?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
router.get('/feed', async (req, res, next) => {
    try {
        const { start_date, end_date } = req.query;
        const data = await getNeoFeed({ start_date, end_date });
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// GET /neo/:id
router.get('/:id', async (req, res, next) => {
    try {
        const data = await getNeoById(req.params.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// GET /neo/browse?page=&size=
router.get('/', async (req, res, next) => {
    try {
        const { page, size } = req.query;
        const data = await browseNeo({
            page: page ? Number(page) : undefined,
            size: size ? Number(size) : undefined
        });
        res.json(data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
