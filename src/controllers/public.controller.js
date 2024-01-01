const db = require("../services/db");

const homepage = (req, res) => {
  res.render("index");
};

const updates = (req, res) => {
  res.render("updates");
};

const chooseRole = (req, res) => {
  res.render("signupAs");
};

const listJobs = async (req, res) => {
  const jobs = await db.job.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.render("allJobs", { jobs });
};

const jobDetails = async (req, res) => {
  const job = await db.job.findUnique({
    where: {
      id: req.params.jobId,
    },
  });
  if (!job) return res.sendStatus(404);
  return res.render("publicJobDetail", { job });
};

const listPosts = async (req, res) => {
  const posts = await db.post.findMany({});
  res.render("posts", { urlPrefix: "/posts", posts });
};
const postDetail = async (req, res) => {
  const post = await db.post.findFirst({
    where: {
      id: req.params.postId,
    },
  });
  if (!post) return res.sendStatus(404);

  res.render("post", { post });
};

module.exports = {
  homepage,
  updates,
  chooseRole,
  listJobs,
  jobDetails,
  listPosts,
  postDetail,
};
