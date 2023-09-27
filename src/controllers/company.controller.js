const db = require("../services/db");

const getJobs = async (req, res) => {
  const jobs = await db.job.findMany({
    where: {
      companyId: req.session.id,
    },
  });
  res.render("jobs", { jobs });
};

module.exports = {
  getJobs,
};
