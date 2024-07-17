const router = require("express").Router();
const db = require("../services/db");

router.get("/people", async (req, res) => {
  const people = await db.user.findMany({
    where: {
      role: {
        not: "ADMIN",
      },
    },
  });
  // filter out the current user if he's logged in
  if (req.session.id) {
    const filteredList = people.filter((p) => p.id !== BigInt(req.session.id));
    const requests = await db.friendRequest.findMany({
      where: {
        requesterId: req.session.id,
      },
    });
    const friends = requests.map((r) => {
      if (r.status === "ACCEPTED") return r.receiverId;
    });
    const pendingReqs = requests.map((r) => {
      if (r.status === "PENDING") return r.receiverId;
    });
    return res.render("people", { people: filteredList, friends, pendingReqs });
  }
  return res.render("people", { people });
});

router.post("/people/friend", async (req, res) => {
  const { personId } = req.body;
  // check personId is present and valid
  if (!personId)
    return res.json({ status: "error", message: "Invalid user id." });
  const person = await db.user.findUnique({
    where: {
      id: personId,
    },
  });
  if (!person)
    return res.json({ status: "error", message: "Invalid user id." });

  // it should not be of the logged in user
  if (personId === req.session.id)
    return res.json({
      status: "error",
      message: "You cannot send request to yourself.",
    });

  // check if a request has already been sent
  const existingRequest = await db.friendRequest.findFirst({
    where: {
      receiverId: personId,
      requesterId: req.session.id,
    },
  });
  if (existingRequest) {
    return res.json({
      status: "error",
      message: "You've already sent a request.",
    });
  }

  // send friend request
  try {
    await db.friendRequest.create({
      data: {
        receiverId: personId,
        requesterId: req.session.id,
        status: "PENDING",
      },
    });
  } catch (e) {
    console.error(e);
    return res.json({
      status: "error",
      message: "Internal Server Error.",
    });
  }

  // TODO: send different responses for request type, json for fetch and template for form submission
  // include a viaFetch key/value when making a fetch request
  res.json({ status: "success" });
});

router.get("/people/:id", async (req, res) => {
  let id;
  try {
    id = BigInt(req.params.id);
  } catch (e) {
    console.error(e);
    return res.sendStatus(404);
  }

  const user = await db.user.findUnique({
    where: { id },
  });
  if (!user) return res.status(404).json({ message: "NOT FOUND.", code: 404 });

  const recentJobs = await db.job.findMany({
    where: {
      userId: id,
    },
  });

  const posts = await db.post.findMany({
    where: {
      userId: id,
    },
  });

  res.render("publicProfile", { user, recentJobs, posts });
});
module.exports = router;
