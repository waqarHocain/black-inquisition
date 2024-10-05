const router = require("express").Router();

// local imports
const messagesController = require("../controllers/messages.controller");

router.get("/:userId", messagesController.msgUser);

router.get("/", messagesController.listChats);

module.exports = router;
