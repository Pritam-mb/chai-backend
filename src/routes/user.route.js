import { Router } from "express";
import { loginuser, logoutuser, register,refreshAcessToken } from "../controllers/user.controller.js";
import { upload} from "../middlewares/multer.middlewire.js"
import { verifyjwt } from "../middlewares/auth.middlewire.js";
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

router.route("/login").post(loginuser)


//secure routes
router.route("/logout").post(verifyjwt, logoutuser)
router.route("/refresh-token").post(refreshAcessToken)
export default router;