const bcrypt = require("bcrypt");

// local imports
const db = require("../services/db");
const jwt = require("../services/jwt");
const validateEmail = require("../utils/validateEmail");
const config = require("../config");
const uploadFile = require("../services/uploadFile");

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

  const token = jwt.generateToken({
    email: user.email,
    id: String(user.id),
    role: user.role,
    verified: user.verified,
  });
  req.session.token = token;
  req.session.id = String(user.id);
  req.session.role = user.role;
  return res.redirect(`/${user.role.toLowerCase()}/profile`);
};

const renderSignupTemplate = (req, res) => {
  res.render("signup");
};

const signup = async (req, res) => {
  const { fullname, email, password, confirmPassword, bio } = req.body;

  if (!req.file) {
    res.locals.errors = { avatar: "No file / invalid file received" };
    res.locals.formData = { fullname, email, password, confirmPassword, bio };
    return res.render("signup");
  }

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
    return res.render("signup");
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
    return res.render("signup");
  }

  const imageUrl = await uploadFile(req.file);
  if (!imageUrl) {
    res.locals.formData = { fullname, email, password, confirmPassword, bio };
    res.locals.errors.avatar = "Error uploading image :(";
    return res.render("signup");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = await db.user.create({
    data: {
      photo: imageUrl,
      name: fullname,
      password: passwordHash,
      email,
      bio,
      role: config.ROLES.USER,
    },
  });
  // create user profile
  await db.person.create({
    data: {
      userId: user.id,
    },
  });
  const token = jwt.generateToken({
    email: user.email,
    id: String(user.id),
    role: user.role,
    verified: user.verified,
  });
  req.session.token = token;
  req.session.id = String(user.id);
  req.session.role = user.role;
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

  if (!req.file) {
    res.locals.errors = { avatar: "No file / invalid file received" };
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
    return res.render("companySignup");
  }

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
    return res.render("companySignup");
  }

  const companyExists = await db.user.findUnique({
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
    return res.render("companySignup");
  }

  const imageUrl = await uploadFile(req.file);
  if (!imageUrl) {
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
    res.locals.errors.avatar = "Error uploading image :(";
    return res.render("companySignup");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const company = await db.user.create({
    data: {
      photo: imageUrl,
      name: companyName,
      password: passwordHash,
      bio: description,
      sources: {
        create: [{ name: source1 }, { name: source2 }],
      },
      email,
      phone,
      role: config.ROLES.COMPANY,
    },
  });
  // create company profile
  await db.company.create({
    data: {
      userId: company.id,
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
  req.session.role = company.role;
  res.redirect("/company/profile");
};

const renderAdminLoginTemplate = (req, res) => {
  res.render("adminLogin");
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.locals.error = "Email or password is missing";
    return res.render("login");
  }

  const admin = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (admin && admin.role === config.ROLES.ADMIN) {
    const passwordMatches = await bcrypt.compare(password, admin.password);
    if (!passwordMatches) {
      res.locals.error = "Incorrect email or password.";
      return res.render("adminLogin");
    }
    if (passwordMatches) {
      const token = jwt.generateToken({
        email: admin.email,
        id: String(admin.id),
        role: admin.role,
      });
      req.session.token = token;
      req.session.id = String(admin.id);
      req.session.role = admin.role;
      return res.redirect("/admin/dashboard");
    }
  }

  res.locals.error = "Incorrect email or password.";
  return res.render("adminLogin");
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
  renderAdminLoginTemplate,
  adminLogin,
};
