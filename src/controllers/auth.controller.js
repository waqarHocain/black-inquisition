const bcrypt = require("bcrypt");

// local imports
const db = require("../services/db");
const config = require("../config");
const uploadFile = require("../services/uploadFile");
const { validateUser } = require("../utils/validateUser");
const { validateCompany } = require("../utils/validateCompany");

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

  req.session.id = String(user.id);
  req.session.role = user.role;
  req.session.verified = user.verified;
  req.session.email = user.email;
  req.session.idHash = Buffer.from(String(user.id)).toString("base64"); // for checking id integrity

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
  const errors = validateUser({
    fullname,
    email,
    password,
    confirmPassword,
    bio,
  });
  if (errors) {
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

  // create user in db
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

  // store session info
  req.session.id = String(user.id);
  req.session.role = user.role;
  req.session.verified = user.verified;
  req.session.email = user.email;

  req.session.idHash = Buffer.from(String(user.id)).toString("base64"); // for checking id integrity

  res.redirect("/user/profile");
};

const renderCompanySignupTemplate = (req, res) => {
  res.render("companySignup");
};

const companySignup = async (req, res) => {
  const reqData = {
    companyName: req.body.companyName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    description: req.body.description,
    phone: req.body.phone,
    source1: req.body.source1,
    source2: req.body.source2,
  };

  if (!req.file) {
    res.locals.errors = { avatar: "No file / invalid file received" };
    res.locals.formData = reqData;
    return res.render("companySignup");
  }

  // data validation
  const errors = validateCompany(reqData);
  if (errors) {
    res.locals.errors = errors;
    res.locals.formData = reqData;
    return res.render("companySignup");
  }

  const companyExists = await db.user.findUnique({
    where: {
      email: reqData.email,
    },
  });
  if (companyExists) {
    res.locals.formData = reqData;
    res.locals.errors = {
      companyExists: "Company with this email address already has an account.",
    };
    return res.render("companySignup");
  }

  const imageUrl = await uploadFile(req.file);
  if (!imageUrl) {
    res.locals.formData = reqData;
    res.locals.errors.avatar = "Error uploading image :(";
    return res.render("companySignup");
  }

  // create company account
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(reqData.password, saltRounds);
  const company = await db.user.create({
    data: {
      photo: imageUrl,
      name: reqData.companyName,
      password: passwordHash,
      bio: reqData.description,
      email: reqData.email,
      phone: reqData.phone,
      role: config.ROLES.COMPANY,
      sources: {
        create: [{ name: reqData.source1 }, { name: reqData.source2 }],
      },
    },
  });

  // store info in session
  req.session.id = String(company.id);
  req.session.role = company.role;
  req.session.verified = company.verified;
  req.session.email = company.email;

  req.session.idHash = Buffer.from(String(company.id)).toString("base64"); // for checking id integrity

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

  if (!admin) {
    res.locals.error = "Incorrect email or password.";
    return res.render("adminLogin");
  }

  if (admin && admin.role !== config.ROLES.ADMIN) {
    res.locals.error = "Incorrect email or password.";
    return res.render("adminLogin");
  }

  const passwordMatches = await bcrypt.compare(password, admin.password);
  if (!passwordMatches) {
    res.locals.error = "Incorrect email or password.";
    return res.render("adminLogin");
  }

  req.session.id = String(admin.id);
  req.session.role = admin.role;
  req.session.email = admin.email;
  req.session.idHash = Buffer.from(String(admin.id)).toString("base64"); // for checking id integrity
  return res.redirect("/admin/dashboard");
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
