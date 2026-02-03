const PlacementApplication = require('../models/PlacementApplication');

exports.createPlacement = async (req, res, next) => {
  const { companyName, role, notes, appliedDate } = req.body;
  try {
    const placement = new PlacementApplication({
      userId: req.user._id,
      companyName,
      role,
      notes: notes || '',
      appliedDate: appliedDate ? new Date(appliedDate) : undefined,
    });

    await placement.save();
    return res.status(201).json({ ok: true, placement });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.getPlacements = async (req, res, next) => {
  try {
    const placements = await PlacementApplication.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ ok: true, placements });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.updatePlacement = async (req, res, next) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    const placement = await PlacementApplication.findById(id);
    if (!placement) return res.status(404).json({ ok: false, message: 'Placement not found' });

    if (placement.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ ok: false, message: 'Forbidden' });
    }

    if (status !== undefined) placement.status = status;
    if (notes !== undefined) placement.notes = notes;

    await placement.save();
    return res.json({ ok: true, placement });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.deletePlacement = async (req, res, next) => {
  const { id } = req.params;
  try {
    const placement = await PlacementApplication.findById(id);
    if (!placement) return res.status(404).json({ ok: false, message: 'Placement not found' });

    if (placement.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ ok: false, message: 'Forbidden' });
    }

    await placement.deleteOne();
    return res.json({ ok: true, message: 'Placement deleted' });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    // Aggregate counts grouped by status for the authenticated user
    const agg = await PlacementApplication.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const byStatus = { Applied: 0, Interview: 0, Rejected: 0, Offer: 0 };
    let total = 0;

    agg.forEach((row) => {
      if (row._id && Object.prototype.hasOwnProperty.call(byStatus, row._id)) {
        byStatus[row._id] = row.count;
      }
      total += row.count;
    });

    return res.json({ ok: true, total, byStatus });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};