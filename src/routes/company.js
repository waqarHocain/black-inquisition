const router = require("express").Router();

// local imports
const companyController = require("../controllers/company.controller");
const uploader = require("../middleware/multer");

router.route("/jobs").get(companyController.getJobs);
router
  .route("/jobs/new")
  .get(companyController.renderCreateJobTemplate)
  .post(companyController.createJob);

// single job detail view
router.get("/jobs/:jobId", companyController.jobDetail);

router
  .route("/jobs/:jobId/edit")
  .get(companyController.renderEditJobTemplate)
  .post(companyController.editJob);

router.post("/jobs/:jobId/delete", companyController.deleteJob);

router.post(
  "/jobs/:jobId/accept/:applicationId",
  companyController.acceptCandidate
);

router.route("/profile").get(companyController.profile);
router.route("/profile/settings").get(companyController.renderSettingsTemplate);
router.route("/profile/settings/bio").post(companyController.updateBio);
router
  .route("/profile/settings/avatar")
  .post(uploader.single("avatar"), companyController.updateAvatar);

// blog posts
router
  .route("/posts")
  .get(companyController.listPosts)
  .post(companyController.createPost);

router.get("/posts/new", companyController.createPostForm);
router.get("/posts/:postId", companyController.viewPost);

module.exports = router;
