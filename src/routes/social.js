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

    const reqsReceived = await db.friendRequest.findMany({
      where: {
        receiverId: req.session.id,
      },
      include: {
        requester: {
          select: {
            photo: true,
            name: true,
            bio: true,
          },
        },
      },
    });

    return res.render("people", {
      people: filteredList,
      friends,
      pendingReqs,
      reqsReceived,
    });
  }
  return res.render("people", { people });
});

// TODO: require auth
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

router.post("/acceptRequest", async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await db.friendRequest.findUnique({
      where: {
        id: requestId,
      },
    });
    if (!request)
      return res.status(400).json({
        status: "error",
        message: "Invalid Request ID.",
      });

    if (request && request.status === "ACCEPTED")
      return res.status(400).json({
        status: "error",
        message: "You're already friends.",
      });
    await db.friendRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "ACCEPTED",
      },
    });
    return res.json({ status: "success" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
  }
});

router.delete("/deleteRequest", async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await db.friendRequest.findUnique({
      where: {
        id: requestId,
      },
    });
    if (!request)
      return res.status(400).json({
        status: "error",
        message: "Invalid Request ID.",
      });

    await db.friendRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "REJECTED",
      },
    });
    return res.json({ status: "success" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
  }
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
