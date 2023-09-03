const profile = (req, res) => {
  console.log(req.session);
  res.render("profile");
};

module.exports = {
  profile,
};
