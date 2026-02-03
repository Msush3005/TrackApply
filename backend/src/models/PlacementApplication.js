const mongoose = require('mongoose');

const placementApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  companyName: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Rejected', 'Offer'],
    default: 'Applied',
  },
  notes: { type: String, default: '' },
  appliedDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('PlacementApplication', placementApplicationSchema);
