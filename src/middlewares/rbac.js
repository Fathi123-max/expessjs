const rbacMiddleware = (roles) => (req, res, next) => {
  const userRole = req.user.role || "user";
  const hasRole = roles.includes(userRole);

  if (!hasRole) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

module.exports = rbacMiddleware;
