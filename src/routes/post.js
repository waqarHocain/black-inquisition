const router = require("express").Router();

// local imports
const postController = require("../controllers/post.controller");
const requireAuth = require("../middleware/requireAuth");
const checkVerified = require("../middleware/checkVerified");

router.get("/", postController.listPosts);
router.get("/:postId", postController.postDetail);

// comments
router.post(
  "/:postId/comments",
  requireAuth,
  checkVerified,
  postController.createComment
);

module.exports = router;
