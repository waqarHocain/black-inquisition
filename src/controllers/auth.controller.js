const bcrypt = require("bcrypt");

// local imports
const db = require("../services/db");
const jwt = require("../services/jwt");
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

  if (user) {
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      res.locals.error = "Incorrect email or password.";
      return res.render("login");
    }
    if (passwordMatches) {
      const token = jwt.generateToken({
        email: user.email,
        id: String(user.id),
        role: user.role,
      });
      req.session.token = token;
      req.session.id = String(user.id);
      return res.redirect("/user/profile");
    }
  }

  const company = await db.company.findUnique({
    where: {
      email,
    },
  });
  if (company) {
    const passwordMatches = await bcrypt.compare(password, company.password);
    if (!passwordMatches) {
      res.locals.error = "Incorrect email or password.";
      return res.render("login");
    }
    if (passwordMatches) {
      const token = jwt.generateToken({
        email: company.email,
        id: String(company.id),
        role: company.role,
        verified: company.verified,
      });
      req.session.token = token;
      req.session.id = String(company.id);
      return res.redirect("/company/profile");
    }
  }
  res.locals.error = "Incorrect email or password.";
  return res.render("login");
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
  const token = jwt.generateToken({
    email: user.email,
    id: String(user.id),
    role: user.role,
  });
  req.session.token = token;
  req.session.id = String(user.id);
  res.redirect("/user/profile");
};

const renderCompanySignupTemplate = (req, res) => {
  res.render("companySignup");
};

const companySignup = async (req, res) => {
  const {
    companyName,
    email,
    password,
    confirmPassword,
    description,
    phone,
    source1,
    source2,
  } = req.body;

  // data validation
  const errors = {};
  if (companyName.length < 2)
    errors.companyName = "Company must be 2 or more characters long";
  if (password.length < 8)
    errors.password = "Password must be 8 or more characters long";
  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords don't match";
  if (!validateEmail(email)) errors.email = "Email is not valid";
  if (description.length < 20)
    errors.description = "Description must be 20 or more characters long";
  if (!source1) errors.source1 = "Source not provided.";
  if (!source2) errors.source2 = "Source not provided.";
  if (!phone) {
    // TODO: validate phone number
    errors.phone = "Phone number not provided";
  }

  if (Object.keys(errors).length !== 0) {
    res.locals.errors = errors;
    res.locals.formData = {
      companyName,
      email,
      password,
      confirmPassword,
      description,
      phone,
      source1,
      source2,
    };
    res.render("companySignup");
    return;
  }
  const companyExists = await db.company.findUnique({
    where: {
      email,
    },
  });
  if (companyExists) {
    res.locals.formData = {
      companyName,
      email,
      password,
      confirmPassword,
      description,
    };
    res.locals.errors = {
      companyExists: "Company with this email address already has an account.",
    };
    res.render("companySignup");
    return;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const company = await db.company.create({
    data: {
      name: companyName,
      password: passwordHash,
      bio: description,
      sources: {
        create: [{ name: source1 }, { name: source2 }],
      },
      email,
      phone,
    },
  });
  const token = jwt.generateToken({
    email: company.email,
    id: String(company.id),
    role: company.role,
    verified: company.verified,
  });
  req.session.token = token;
  req.session.id = String(company.id);
  // TODO: redirect to profile / wait for verfication page
  res.redirect("/auth/company/signup");
};

const logout = (req, res) => {
  req.session = null;
  res.redirect("/");
};

module.exports = {
  login,
  signup,
  renderLoginTemplate,
  renderSignupTemplate,
  renderCompanySignupTemplate,
  companySignup,
  logout,
};
