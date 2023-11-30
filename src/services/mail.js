const nodemailer = require("nodemailer");

// local imports
const { EMAIL } = require("../config");

const transporter = nodemailer.createTransport({
  host: EMAIL.HOST,
  port: EMAIL.PORT,
  auth: {
    user: EMAIL.USER,
    pass: EMAIL.PASSWORD,
  },
});

module.exports = { transporter };
