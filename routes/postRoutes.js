const { Router } = require("express");

const appPostController = require("../Controllers/postController");

const router = Router();

router.get("/", appPostController.getPosts);

module.exports = router;
