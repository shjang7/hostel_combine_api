// @desc    Get all hostels
// @route   GET /api/v1/hostels
// @access  Public
exports.getHostels = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all hostels' });
};

// @desc    Get single hostel
// @route   GET /api/v1/hostels/:id
// @access  Public
exports.getHostel = async (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show hostel ${req.params.id}` });
};

// @desc    Create hostel
// @route   POST /api/v1/hostels
// @access  Private
exports.createHostel = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new hostel' });
};

// @desc    Update hostel
// @route   PUT /api/v1/hostels/:id
// @access  Private
exports.updateHostel = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update hostels ${req.params.id}` });
};

// @desc    Delete hostel
// @route   DELETE /api/v1/hostels/:id
// @access  Private
exports.deleteHostel = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete hostel ${req.params.id}` });
};
