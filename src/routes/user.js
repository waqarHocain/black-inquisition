const router = require("express").Router();

// local imports
const uploader = require("../middleware/multer");
const userController = require("../controllers/user.controller");

router.get("/profile", userController.profile);
router.route("/profile/settings").get(userController.renderSettingsTemplate);
router.route("/profile/settings/bio").post(userController.updateBio);
router
  .route("/profile/settings/avatar")
  .post(uploader.single("avatar"), userController.updateAvatar);

router.post("/jobs/apply/:jobId", userController.applyJob);
router.get("/jobs/apply/:jobId/success", userController.applyJobSuccess);

// blog posts
router.route("/posts").post(userController.createPost);
router.get("/posts/new", userController.createPostForm);

module.exports = router;
