const bcrypt = require("bcrypt");

// local imports
const db = require("../services/db");
const validateEmail = require("../utils/validateEmail");

const renderLoginTemplate = (req, res) => {
  res.render("login");
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.locals.error = "Email or password is missing";
    return res.render("login");
  }

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    res.locals.error = "Incorrect email or password.";
    return res.render("login");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    res.locals.error = "Incorrect email or password.";
    return res.render("login");
  }

  if (passwordMatches) {
    req.session.id = String(user.id);
    return res.redirect("/user/profile");
  }
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
  req.session.id = String(user.id);
  res.redirect("/user/profile");
};

const renderCompanySignupTemplate = (req, res) => {
  res.render("companySignup");
};

module.exports = {
  login,
  signup,
  renderLoginTemplate,
  renderSignupTemplate,
  renderCompanySignupTemplate,
};
