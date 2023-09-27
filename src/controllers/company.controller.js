const db = require("../services/db");

const getJobs = async (req, res) => {
  const jobs = await db.job.findMany({
    where: {
      companyId: req.session.id,
    },
  });
  res.render("jobs", { jobs });
};

const profile = async (req, res) => {
  const company = await db.company.findUnique({
    where: {
      id: req.session.id,
    },
    include: {
      jobs: true,
    },
  });

  res.render("companyProfile", { company });
};

module.exports = {
  getJobs,
  profile,
};
