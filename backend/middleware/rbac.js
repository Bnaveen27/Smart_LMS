function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized request' });
    }

    if (allowedRoles.includes(req.user.role) || req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    return res.status(403).json({
      error: `Access Denied: Role '${req.user.role}' is not authorized for this resource.`
    });
  };
}

module.exports = { authorizeRoles };
