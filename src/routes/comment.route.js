import { Router } from 'express';
import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
} from "../controllers/comment.controller.js"
import {verifyjwt} from "../middlewares/auth.middlewire.js"

const router = Router();

// All routes require authentication
router.use(verifyjwt);

router.route("/:videoId").get(getVideoComments);
router.route("/:videoId").post(addComment);
router.route("/c/:commentId").delete(deleteComment);
router.route("/c/:commentId").patch(updateComment);

export default router;