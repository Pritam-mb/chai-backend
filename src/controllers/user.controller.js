import { request, response } from "express"
import {asyncHandler} from "../utils/asyncHandler.js"
import apierror from "../utils/apierror.js";
import {User} from "../models/user.model.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
// import {fullname, email } from "../models/user.model.js"
const register = asyncHandler(async (req, res) => {
    // get details from user
    //validation - not empty
    //check if user already exist : username email
    //avater exist , check for images
    //upload to cloudinary, avater
    // create user object - create entry at db
    // remove password and refresh token field from response
    // check for user validation - exist or  upload everthing or not
    // return response

    const { fullname, email, username, password } = req.body
    console.log("email:", email);

    // Validate required fields: non-empty strings after trimming
    if ([fullname, email, username, password].some(e => !e || (typeof e === "string" && e.trim() === ""))) {
        throw new apierror("Please provide fullname, email, username and password", 400)
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
    throw new apierror("Invalid email format", 400);
   }
   const existuser = User.findOne({
    $or: [{username},{email}]
   })
   if (existuser) {
    throw new apierror("arey bhadwa tuu hai lekin tujko pata nhi hai",409)
   }
    console.log(
        
    );
     const avatarlocal= req.files?.avater[0]?.path 
     const coverlocal= req.files?.coverImage[0]?.path; //it actually get the file path which multer  returns the img url
    if(!(avatarlocal)){
        throw new apierror("avatar dal jaldi",400)
    }
    const avatar = await uploadCloudinary(avatarlocal) //upload cloudinary
    const coverfile = await uploadCloudinary(coverlocal)

    if(!avatar){
            throw new apierror("avatar dal jaldi",400)

    }
})
export { register }