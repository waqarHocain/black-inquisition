const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const ROLES = {
  COMPANY: "COMPANY",
  USER: "USER",
  ADMIN: "ADMIN",
};

module.exports = {
  PORT,
  SESSION_SECRET,
  TOKEN_SECRET,
  ROLES,
};
