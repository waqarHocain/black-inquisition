const db = require("../services/db");
const uploadFile = require("../services/uploadFile");
const { EMAIL, ROLES } = require("../config");
const mailQueue = require("../services/mailQueue");
const { jobSelection } = require("../utils/emailTemplates/jobSelection");

const getJobs = async (req, res) => {
  const jobs = await db.job.findMany({
    where: {
      userId: req.session.id,
    },
    include: {
      applications: true,
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
    include: {
      applications: {
        select: {
          id: true,
          accepted: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!job) return res.sendStatus(404);

  // if there's a accepted application
  let isApplicationAccepted = false;
  job.applications.map((app) => {
    if (app.accepted) isApplicationAccepted = true;
  });

  // if isApplicationAccepted is true, set acceptedCandidate
  let acceptedCandidate = null;
  if (isApplicationAccepted) {
    acceptedCandidate = job.applications.filter(
      (app) => app.accepted === true
    )[0].User;
  }

  return res.render("jobDetail", {
    job,
    isApplicationAccepted,
    acceptedCandidate,
  });
};

const profile = async (req, res) => {
  const company = await db.user.findUnique({
    where: {
      id: req.session.id,
    },
    include: {
      jobs: {
        select: {
          id: true,
          title: true,
          location: true,
          workplace: true,
          type: true,
          _count: {
            select: {
              applications: true,
            },
          },
        },
      },
    },
  });

  res.render("companyProfile", { company: company, jobs: company.jobs });
};

const renderSettingsTemplate = async (req, res) => {
  const company = await db.user.findUnique({
    where: {
      id: req.session.id,
    },
  });
  if (!company) throw new Error("Invalid company id");
  res.render("companyProfileSettings", { company, errors: {} });
};

const updateBio = async (req, res) => {
  const { bio } = req.body;

  const company = await db.user.findUnique({
    where: {
      id: req.session.id,
    },
  });
  if (!company) throw new Error("Couldn't find company, invalid id.");

  const errors = {};
  if (bio.trim().length < 20) {
    errors.bio = "Bio must be 20 or more characters long.";
    return res.render("companyProfileSettings", {
      company,
      errors,
    });
  }

  try {
    await db.user.update({
      where: {
        id: company.id,
      },
      data: {
        bio: bio,
      },
    });
  } catch (e) {
    console.error(e);
    throw e;
  }

  res.redirect("/company/profile");
};

const updateAvatar = async (req, res) => {
  const company = await db.user.findUnique({
    where: {
      id: req.session.id,
    },
  });
  if (!company) throw new Error("Couldn't find company, invaid id.");

  const errors = {};

  if (!req.file) {
    errors.avatar = "No or invalid file selected.";
    return res.render("companyProfileSettings", {
      company,
      errors,
    });
  }

  const imgUrl = await uploadFile(req.file);
  if (!imgUrl) throw new Error("There was a problem uploading image.");

  try {
    await db.user.update({
      where: {
        id: company.id,
      },
      data: {
        photo: imgUrl,
      },
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
  return res.redirect("/company/profile");
};

const renderCreateJobTemplate = (req, res) => {
  return res.render("createJob");
};

const createJob = async (req, res) => {
  const { title, company, location, workplace, jobType, description } =
    req.body;

  // TODO: move validation to a separate file
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

  // make sure a company user is logged in
  if (req.session.role !== ROLES.COMPANY) {
    req.session = null; // invalidate session
    return res.redirect("/auth/login");
  }

  const job = await db.job.create({
    data: {
      title,
      location,
      company,
      workplace,
      description,
      type: jobType,
      userId: req.session.id,
    },
  });

  return res.redirect("/company/profile");
};

const renderEditJobTemplate = async (req, res) => {
  const [job, company] = await db.$transaction([
    db.job.findUnique({
      where: {
        id: req.params.jobId,
      },
    }),
    db.user.findUnique({
      where: {
        id: req.session.id,
      },
    }),
  ]);
  // check job belongs to current user
  if (job.userId !== company.id) return res.sendStatus(403);

  if (!job) return res.redirect("/company/profile");
  return res.render("editJob", { job });
};

const editJob = async (req, res) => {
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
    return res.render("editJob");
  }

  const jobId = req.params.jobId;
  const [job, companyModel] = await db.$transaction([
    db.job.findUnique({
      where: {
        id: jobId,
      },
    }),
    db.user.findUnique({
      where: {
        id: req.session.id,
      },
    }),
  ]);
  if (!job) return res.sendStatus(404);

  // check job belongs to current user
  if (job.userId !== companyModel.id) return res.sendStatus(403);

  await db.job.update({
    where: {
      id: jobId,
    },
    data: {
      title,
      location,
      company,
      workplace,
      description,
      type: jobType,
    },
  });
  return res.redirect("/company/profile");
};

const deleteJob = async (req, res) => {
  const { jobId } = req.params;
  const [job, company] = await db.$transaction([
    db.job.findUnique({
      where: {
        id: jobId,
      },
    }),
    db.user.findUnique({
      where: {
        id: req.session.id,
      },
    }),
  ]);

  // check job belongs to current user
  if (job.userId !== company.id) return res.sendStatus(403);

  await db.job.delete({
    where: {
      id: jobId,
    },
  });
  return res.redirect("/company/profile");
};

const acceptCandidate = async (req, res) => {
  const { jobId, applicationId } = req.params;
  const job = await db.job.findUnique({
    where: {
      id: jobId,
    },
    select: {
      id: true,
      title: true,
      location: true,
      type: true,
      workplace: true,
      User: {
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
        },
      },
      applications: {
        select: {
          id: true,
          accepted: true,
          User: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const company = job.User;

  // make sure that job belongs to the company
  if (String(company.id) !== req.session.id) {
    return res.sendStatus(403);
  }

  // application is for this job
  const application = job.applications.filter(
    (appl) => String(appl.id) === applicationId
  );
  if (application.length !== 1) {
    return res.sendStatus(403);
  }

  // no other applications have been accepted previously
  const acceptedApps = job.applications.filter(
    (appl) => appl.accepted === true
  );
  if (acceptedApps.length > 0) {
    return res.json({
      error: "You've already accepted an application",
    });
  }

  await db.application.update({
    where: {
      id: applicationId,
    },
    data: {
      accepted: true,
    },
  });

  const candidateEmail = application[0].User.email;
  const mailBody = jobSelection(company, {
    id: job.id,
    title: job.title,
    location: job.location,
    type: job.type,
    workplace: job.workplace,
  });
  const mailData = {
    from: EMAIL.FROM,
    to: candidateEmail,
    subject: "BlackInquisition - You've been selected for a job!",
    html: mailBody,
  };
  await mailQueue.add(mailData);

  return res.redirect(`/company/jobs/${req.params.jobId}`);
};

const listPosts = async (req, res) => {
  const posts = await db.post.findMany({
    where: {
      userId: req.session.id,
    },
  });

  return res.render("posts", { urlPrefix: "/company/posts", posts });
};

const createPost = async (req, res) => {
  const { title, body } = req.body;
  // body length 27 including html tags, inner text should be 20 if body.length is 27
  if (title.length < 4 || body.length < 27) {
    return res.status(400).json({
      error: "Either post body or title is too short / invalid.",
      statusCode: 400,
    });
  }

  await db.post.create({
    data: {
      title,
      body,
      userId: req.session.id,
    },
  });

  return res.redirect("/company/posts");
};
const createPostForm = async (req, res) => {
  res.render("createPost", { action_url: "/company/posts" });
};

const viewPost = async (req, res) => {
  const { postId } = req.params;
  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) return res.sendStatus(404);

  return res.render("post", { post });
};

module.exports = {
  getJobs,
  renderCreateJobTemplate,
  createJob,
  renderEditJobTemplate,
  editJob,
  deleteJob,
  jobDetail,
  profile,
  renderSettingsTemplate,
  updateAvatar,
  updateBio,
  acceptCandidate,
  listPosts,
  createPost,
  createPostForm,
  viewPost,
};
