const db = require("../services/db");

const getJobs = async (req, res) => {
  const jobs = await db.job.findMany({
    where: {
      companyId: req.session.id,
    },
  });
  res.render("jobs", { jobs });
};

const jobDetail = async (req, res) => {
  const { jobId } = req.params;

  const job = await db.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) return res.redirect("/");

  return res.render("jobDetail", { job });
};

const profile = async (req, res) => {
  const company = await db.company.findUnique({
    where: {
      id: req.session.id,
    },
    include: {
      jobs: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  res.render("companyProfile", { company });
};

const renderCreateJobTemplate = (req, res) => {
  return res.render("createJob");
};

const createJob = async (req, res) => {
  const { title, company, location, workplace, jobType, description } =
    req.body;

  const errors = {};

  if (title.trim().length < 8)
    errors.title = "Title must be 8 or more characters long";
  if (!company.trim()) errors.company = "Please enter company name";
  if (!location.trim()) errors.location = "Please enter a valid location";
  if (description.trim().length < 30)
    errors.description = "Job description must be 30 or more charcters long";

  const workplaceOptions = ["onSite", "hybrid", "remote"];
  const jobTypeOptions = [
    "fullTime",
    "partTime",
    "contract",
    "temporary",
    "volunteer",
    "internship",
    "other",
  ];

  if (!workplaceOptions.includes(workplace))
    errors.workplace = "Invalid workplace type";
  if (!jobTypeOptions.includes(jobType)) errors.jobType = "Invalid job type";

  // if there're errors, render template with errors
  if (Object.keys(errors).length !== 0) {
    res.locals.errors = errors;
    return res.render("createJob");
  }

  const job = await db.job.create({
    data: {
      title,
      location,
      company,
      workplace,
      description,
      type: jobType,
      companyId: req.session.id,
    },
  });

  return res.redirect("/company/profile");
};

module.exports = {
  getJobs,
  renderCreateJobTemplate,
  createJob,
  jobDetail,
  profile,
};
