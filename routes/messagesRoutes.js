const { Router } = require("express");

const messagesController = require("../controllers/MessagesController");

const router = Router();

router.get("/", messagesController.getConversations);
router.get("/followedList", messagesController.getFollowedList);
router.get("/:userId1/:userId2", messagesController.getMessages);
router.post("/", messagesController.addMessage);

module.exports = router;
