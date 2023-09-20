const jwt = require("jsonwebtoken");

// local imports
const config = require("../config");

const generateToken = (payload) => {
  return jwt.sign(payload, config.TOKEN_SECRET, {
    expiresIn: "15 days",
  });
};

const verifyToken = (token) => {
  let decodedToken;
  try {
    decodedToken = jwt.decode(token, config.TOKEN_SECRET);
  } catch (e) {
    console.error(e);
    return null;
  }
  return decodedToken;
};

module.exports = {
  generateToken,
  verifyToken,
};
