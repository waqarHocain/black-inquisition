const bcrypt = require("bcrypt");

// local imports
const db = require("../services/db");
const validateEmail = require("../utils/validateEmail");

const renderLoginTemplate = (req, res) => {
  res.render("login");
};

const login = (req, res) => {
  const { email, password } = req.body;
  // TODO
  console.log(email, password);
  res.redirect("/");
};

const renderSignupTemplate = (req, res) => {
  res.render("signup");
};

const signup = async (req, res) => {
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
    return;
  }
  const userExists = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (userExists) {
    res.locals.formData = { fullname, email, password, confirmPassword, bio };
    res.locals.errors = {
      userExists: "User with this email address already has an account.",
    };
    res.render("signup");
    return;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = await db.user.create({
    data: {
      name: fullname,
      password: passwordHash,
      email,
      bio,
    },
  });
  req.session.id = user.id;
  console.log("session ", req.session);
  console.log("id ", req.session.id);
  res.redirect("/user/profile");
};

module.exports = {
  login,
  signup,
  renderLoginTemplate,
  renderSignupTemplate,
};
