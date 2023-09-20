const db = require("../services/db");

const getJobs = (req, res) => {
  res.send("all jobs");
};

module.exports = {
  getJobs,
};
