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

const createComment = async (req, res) => {
  const { postId } = req.params;
  const userId = req.session.id;
  const { comment } = req.body;

  if (!comment.trim() || comment.length < 2) return res.sendStatus(400);

  await db.comment.create({
    data: {
      body: comment,
      userId,
      postId,
    },
  });

  res.redirect(`/posts/${postId}`);
};

module.exports = {
  listPosts,
  postDetail,
  createComment,
};
