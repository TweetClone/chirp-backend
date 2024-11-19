const { Router } = require("express");

const postController = require("../controllers/PostController");

const router = Router();

router.get("/", postController.getPosts);
router.post("/", postController.addPost);
router.post("/likePost", postController.likePost);
router.delete("/unlikePost", postController.unlikePost);
router.post("/addRepost", postController.addRepost);
router.delete("/deleteRepost", postController.deleteRepost);
router.delete("/deletePost", postController.deletePost);
router.get("/fetchPost", postController.getPost);
router.get("/fetchReplies", postController.getReplies);
router.post("/postReply", postController.addReply);
router.put("/editPost", postController.editPost);

module.exports = router;
