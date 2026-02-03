const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const placementRoutes = require('./placements');

router.use('/auth', authRoutes);
router.use('/placements', placementRoutes);

module.exports = router;
