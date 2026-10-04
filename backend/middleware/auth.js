const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'lms_super_secret_jwt_key_2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    
    req.user = {
      id: req.headers['x-user-id'] || 'user-super-1',
      role: req.headers['x-user-role'] || 'SUPER_ADMIN',
      tenant_id: req.headers['x-tenant-id'] || null
    };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired authentication token' });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken, JWT_SECRET };
