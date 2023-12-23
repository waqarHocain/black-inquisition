const db = require("../services/db");
const uploadFile = require("../services/uploadFile");
const mailQueue = require("../services/mailQueue");
const { newCandidate } = require("../utils/emailTemplates/newCandidate");
const { EMAIL } = require("../config");

const profile = async (req, res) => {
  const user = await db.user.findUnique({
    where: {
      id: req.session.id,
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
      userId: user.id,
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
      id: req.session.id,
    },
  });
  if (!user) throw new Error("Couldn't find user");
  res.render("profileSettings", { user, errors: {} });
};

const updateBio = async (req, res) => {
  const { bio } = req.body;
  const user = await db.user.findUnique({
    where: {
      id: req.session.id,
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
      id: req.session.id,
    },
    data: {
      bio: bio,
    },
  });
  res.redirect("/user/profile");
};

const updateAvatar = async (req, res) => {
  const user = await db.user.findUnique({
    where: {
      id: req.session.id,
    },
  });
  if (!user) throw new Error("Couldn't find user");

  const errors = {};

  if (!req.file) {
    errors.avatar = "No or invalid file selected.";
    return res.render("profileSettings", {
      user,
      errors,
    });
  }

  const imgUrl = await uploadFile(req.file);
  if (!imgUrl) throw new Error("There was a problem uploading image.");

  try {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        photo: imgUrl,
      },
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
  return res.redirect("/user/profile");
};

const applyJob = async (req, res) => {
  const { jobId } = req.params;
  const user = await db.user.findUnique({
    where: {
      id: req.session.id,
    },
  });

  const jobApplication = await db.application.findFirst({
    where: {
      jobId,
      userId: user.id,
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
      userId: user.id,
    },
  });

  const job = await db.job.findUnique({
    where: {
      id: jobId,
    },
    include: {
      User: {
        select: {
          email: true,
        },
      },
    },
  });

  const mailBody = newCandidate(user);
  const mailData = {
    from: EMAIL.FROM,
    to: job.User.email,
    subject: "BlackInquisition - New job application received",
    html: mailBody,
  };
  await mailQueue.add(mailData);

  return res.redirect(`/user/jobs/apply/${jobId}/success`);
};

const applyJobSuccess = async (req, res) => {
  const user = await db.user.findUnique({
    where: {
      id: req.session.id,
    },
  });

  const application = await db.application.findFirst({
    where: {
      jobId: req.params.jobId,
      userId: user.id,
    },
  });
  if (!application) return res.sendStatus(403);
  return res.render("appliedJob", { error: null });
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

  return res.redirect("/user/posts");
};

const createPostForm = async (req, res) => {
  res.render("createPost", { action_url: "/user/posts" });
};

const listPosts = async (req, res) => {
  const userId = req.session.id;
  const posts = await db.post.findMany({
    where: {
      userId,
    },
  });

  return res.render("posts", { urlPrefix: "/user/posts", posts });
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
  profile,
  applyJob,
  applyJobSuccess,
  renderSettingsTemplate,
  updateBio,
  updateAvatar,
  createPost,
  createPostForm,
  listPosts,
  viewPost,
};
