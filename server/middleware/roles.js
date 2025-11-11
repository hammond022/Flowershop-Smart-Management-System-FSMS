export function requirePermission(resource, action) {
  return (req, res, next) => {
    const role = req.user?.role;

    if (role?.admin?.isAdmin) {
      return next();
    }

    const resourceRole = role?.[resource];
    if (!resourceRole || resourceRole[action] !== true) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
}
