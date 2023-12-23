const checkRole = (role) => {
  return (req, res, next) => {
    if (req.session.role === role) {
      return next();
    }
    return res.sendStatus(401);
  };
};

module.exports = checkRole;
