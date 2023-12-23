const requireAuth = async (req, res, next) => {
  const id = req.session.id;
  const idHash = req.session.idHash;

  if (id && idHash) {
    const decodedId = Buffer.from(idHash, "base64").toString("ascii");
    if (decodedId === id) return next();
  }
  return res.redirect("/auth/login");
};

module.exports = requireAuth;
