const onlyCompanyAuthorized = async (req, res, next) => {
  if (req.role && req.role === "COMPANY") {
    return next();
  }
  return res.sendStatus(401);
};

module.exports = onlyCompanyAuthorized;
