const db = require("../services/db");

const listPosts = async (req, res) => {
  const posts = await db.post.findMany({});
  res.render("posts", { urlPrefix: "/posts", posts });
};

const postDetail = async (req, res) => {
  const { postId } = req.params;

  const post = await db.post.findFirst({
    where: {
      id: postId,
    },
    include: {
      comments: {
        select: {
          id: true,
          body: true,
          createdAt: true,
          User: {
            select: {
              name: true,
            },
          },
          Children: {
            select: {
              id: true,
              body: true,
              createdAt: true,
              User: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  console.log(post);

  // check if user has liked the post, if logged in
  let isLiked = false;
  if (req.session.id) {
    const like = await db.like.findUnique({
      where: {
        userId_postId: {
          postId,
          userId: req.session.id,
        },
      },
    });
    if (like) isLiked = true;
  }

  if (!post) return res.sendStatus(404);

  res.render("post", { post, isLiked });
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

const replyToComment = async (req, res) => {
  const { postId } = req.params;
  const userId = req.session.id;
  const { comment, parentCommentId } = req.body;

  if (!comment.trim() || comment.length < 2)
    return res.status(400).json({
      error: "Comment should be 2 or more characters long.",
    });

  try {
    await db.comment.create({
      data: {
        body: comment,
        userId,
        postId,
        parentId: parentCommentId,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }

  res.redirect(`/posts/${postId}`);
};

module.exports = {
  listPosts,
  postDetail,
  createComment,
  replyToComment,
};
