const router = require("express").Router();

// local imports
const postController = require("../controllers/post.controller");

router.get("/", postController.listPosts);
router.get("/:postId", postController.postDetail);

module.exports = router;
