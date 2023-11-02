const db = require("../services/db");

const profile = async (req, res) => {
  const user = await db.user.findUnique({
    where: {
      id: req.user.id,
    },
  });
  if (!user) throw new Error("Couldn't find user");

  const recentJobs = await db.job.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });

  const userApplications = await db.application.findMany({
    where: {
      userId: req.user.id,
    },
  });

  let jobsApplied = [];
  if (userApplications.length > 0) {
    jobsApplied = await db.job.findMany({
      where: {
        id: {
          in: userApplications.map((ua) => ua.jobId),
        },
      },
    });
  }

  res.render("profile", { user, recentJobs, jobsApplied });
};

const renderSettingsTemplate = async (req, res) => {
  const user = await db.user.findUnique({
    where: {
      id: req.user.id,
    },
  });
  if (!user) throw new Error("Couldn't find user");
  res.render("profileSettings", { user, errors: {} });
};

const updateBio = async (req, res) => {
  const { bio } = req.body;
  const user = await db.user.findUnique({
    where: {
      id: req.user.id,
    },
  });
  if (!user) throw new Error("Couldn't find user");

  const errors = {};

  if (bio.trim().length < 20) {
    errors.bio = "Bio must be 20 or more characters long.";
    return res.render("profileSettings", {
      user,
      errors,
    });
  }

  await db.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      bio: bio,
    },
  });
  res.redirect("/user/profile");
};

const applyJob = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id;

  const jobApplication = await db.application.findFirst({
    where: {
      jobId,
      userId,
    },
  });

  if (jobApplication) {
    return res.render("appliedJob", {
      error: "You've already applied for this job.",
    });
  }

  await db.application.create({
    data: {
      jobId,
      userId,
    },
  });

  return res.redirect(`/user/jobs/apply/${jobId}/success`);
};

const applyJobSuccess = async (req, res) => {
  const application = await db.application.findFirst({
    where: {
      jobId: req.params.jobId,
      userId: req.user.id,
    },
  });
  if (!application) return res.sendStatus(403);
  return res.render("appliedJob");
};

module.exports = {
  profile,
  applyJob,
  applyJobSuccess,
  renderSettingsTemplate,
  updateBio,
};
