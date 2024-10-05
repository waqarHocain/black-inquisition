const db = require("../services/db");

const msgUser = async (req, res) => {
  res.render("messageUser");
};

const listChats = async (req, res) => {
  res.json({ msg: "ok" });
};

module.exports = {
  msgUser,
  listChats,
};
