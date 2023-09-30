const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    return res.sendStatus(401);
  };
};

module.exports = checkRole;
