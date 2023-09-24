const db = require("../services/db");

const getJobs = async (req, res) => {
  const jobs = await db.job.findMany({
    where: {
      companyId: req.session.id,
    },
  });
  console.log(jobs);
  res.render("jobs", { jobs });
};

module.exports = {
  getJobs,
};
