const checkRole = (role) => {
  return (req, res, next) => {
    if (req.role && req.role === role) {
      return next();
    }
    return res.sendStatus(401);
  };
};

module.exports = checkRole;
