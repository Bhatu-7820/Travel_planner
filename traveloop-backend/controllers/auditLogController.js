const AuditLog = require('../models/AuditLog');

exports.logAction = async (adminId, action, target, targetId, details, ip) => {
  try {
    await AuditLog.create({ adminId, action, target, targetId, details, ipAddress: ip });
  } catch (error) {
    console.error('Audit Log Error:', error);
  }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().populate('adminId', 'name email').sort('-createdAt').limit(100);
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};
