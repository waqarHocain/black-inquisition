const checkVerified = (req, res, next) => {
  if (req.user && req.user.verified) {
    return next();
  }
  return res.redirect("/account/unverified");
};

module.exports = checkVerified;
