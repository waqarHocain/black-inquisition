const homepage = (req, res) => {
  res.render("index");
};

const updates = (req, res) => {
  res.render("updates");
};

const chooseRole = (req, res) => {
  res.render("signupAs");
};

module.exports = {
  homepage,
  updates,
  chooseRole,
};
