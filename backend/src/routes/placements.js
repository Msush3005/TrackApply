const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const placementController = require('../controllers/placementController');
const requireAuth = require('../middleware/auth');
const validate = require('../middleware/validate');

// Create application
router.post('/', requireAuth, [
  body('companyName').isLength({ min: 1 }).withMessage('companyName is required'),
  body('role').isLength({ min: 1 }).withMessage('role is required'),
  body('appliedDate').optional().isISO8601().withMessage('appliedDate must be a valid date'),
  body('notes').optional().isString(),
], validate, placementController.createPlacement);

// Get all applications for logged-in user
router.get('/', requireAuth, placementController.getPlacements);

// Analytics: total & count grouped by status for the logged-in user
router.get('/analytics', requireAuth, placementController.getAnalytics);

// Update status and notes
router.put('/:id', requireAuth, [
  param('id').isMongoId().withMessage('Valid id is required'),
  body('status').optional().isIn(['Applied', 'Interview', 'Rejected', 'Offer']).withMessage('Invalid status'),
  body('notes').optional().isString(),
], validate, placementController.updatePlacement);

// Delete application
router.delete('/:id', requireAuth, [
  param('id').isMongoId().withMessage('Valid id is required'),
], validate, placementController.deletePlacement);

module.exports = router;