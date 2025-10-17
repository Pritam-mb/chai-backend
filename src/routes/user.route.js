import { Router } from "express";
import { register } from "../controllers/user.controller.js";
import { upload} from "../middlewares/multer.middlewire.js"
const router = Router();
router.route("/register").post(
    upload.fields([   //middlewire which take avater and coverimage file
        {
            name: "avatar",
            maxCount: 1
        },{
            name: "coverImage",
            maxCount: 1
        }
    ]),
    register)
export default router;