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
  // if (req.session.id) {
  //   const filteredList = people.filter((p) => p.id === req.session.id);
  //   return res.render("people", { people: filteredList });
  // }
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

  // check if the person is already a friend

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
module.exports = router;
