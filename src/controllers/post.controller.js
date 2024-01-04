const db = require("../services/db");

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
  listPosts,
  postDetail,
};
