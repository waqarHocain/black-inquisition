const validateEmail = require("../utils/validateEmail");

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
  // TODO: prepopulate form in case of errors
  const { fullname, email, password, confirmPassword, bio } = req.body;

  // data validation
  const errors = {};
  if (fullname.length < 4)
    errors.fullname = "Username must be 4 or more characters long";
  if (password.length < 8)
    errors.password = "Password must be 8 or more characters long";
  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords don't match";
  if (!validateEmail(email)) errors.email = "Email is not valid";
  if (bio.length < 20) errors.bio = "Bio must be 20 or more characters long";

  if (Object.keys(errors).length !== 0) {
    res.locals.errors = errors;
    res.locals.formData = { fullname, email, password, confirmPassword, bio };
    res.render("signup");
  } else {
    res.redirect("/");
  }
};

module.exports = {
  login,
  signup,
  renderLoginTemplate,
  renderSignupTemplate,
};
