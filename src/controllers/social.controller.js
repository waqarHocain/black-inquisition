const db = require("../services/db");

const getAllProfiles = async (req, res) => {
  const people = await db.user.findMany({
    where: {
      role: {
        not: "ADMIN",
      },
    },
  });
  // filter out the current user if he's logged in
  if (req.session.id) {
    const userId = req.session.id;
    const filteredList = people.filter((p) => p.id !== BigInt(req.session.id));
    const requests = await db.friendRequest.findMany({
      where: {
        requesterId: req.session.id,
      },
    });

    const pendingReqsIds = requests.map((r) => {
      if (r.status === "PENDING") return r.receiverId;
    });

    // pending requests, but with more info
    const reqsReceived = await db.friendRequest.findMany({
      where: {
        receiverId: req.session.id,
        AND: {
          status: "PENDING",
        },
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

    // get the target user ids
    const friendships = await db.friend.findMany({
      where: {
        OR: [{ friendId: userId }, { userId }],
      },
    });
    let friendsBySending = friendships.filter(
      (f) => f.userId === BigInt(userId)
    );
    friendsBySending = friendsBySending.map((f) => f.friendId);

    let friendsByAccepting = friendships.filter(
      (f) => f.friendId === BigInt(userId)
    );
    friendsByAccepting = friendsByAccepting.map((f) => f.userId);
    const friends = [...friendsByAccepting, ...friendsBySending];

    return res.render("people", {
      people: filteredList,
      friends,
      pendingReqsIds,
      reqsReceived,
    });
  }
  return res.render("people", { people });
};

const getPublicProfile = async (req, res) => {
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
};

const sendFriendRequest = async (req, res) => {
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
};

const acceptFriendRequest = async (req, res) => {
  const { requestId, requesterId } = req.body;

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

    await db.$transaction([
      db.friendRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status: "ACCEPTED",
        },
      }),
      db.friend.create({
        data: {
          userId: req.session.id,
          friendId: requesterId,
        },
      }),
    ]);
    return res.json({ status: "success" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
  }
};

const deleteFriendRequest = async (req, res) => {
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
};

module.exports = {
  getPublicProfile,
  getAllProfiles,
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
};
