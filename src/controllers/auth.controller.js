const renderLoginTemplate = (req, res) => {
  res.render("login");
};

const login = (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  res.redirect("/");
};

const renderSignupTemplate = (req, res) => {
  res.render("signup");
};
const signup = (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;
  console.log(fullname, email, password, confirmPassword);
  res.redirect("/");
};

module.exports = {
  login,
  signup,
  renderLoginTemplate,
  renderSignupTemplate,
};
