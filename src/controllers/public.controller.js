const homepage = (req, res) => {
  res.render("index");
};

const updates = (req, res) => {
  res.render("updates");
};

module.exports = {
  homepage,
  updates,
};
