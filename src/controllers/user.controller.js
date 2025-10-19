import { request, response } from "express"
import {asyncHandler} from "../utils/asyncHandler.js"
import apierror from "../utils/apierror.js";
import {User} from "../models/user.model.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
import { apiresponse } from "../utils/apiresponse.js";
import { upload } from "../middlewares/multer.middlewire.js";
// import {fullname, email } from "../models/user.model.js"
const register = asyncHandler(async (req, res) => {
    console.log("BODY:", req.body);
console.log("FILES:", req.files);

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


   const existuser = await User.findOne({ //check user exist
    $or: [{username},{email}]
   })
   if (existuser) {
    throw new apierror("arey bhadwa tuu hai lekin tujko pata nhi hai",409)
   }
   
     const avatarlocal= req.files?.avatar[0]?.path //check if avatar exist
    //  const coverlocal= req.files?.coverImage[0]?.path; //it actually get the file path which multer  returns the img url
    let coverlocal;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverlocal = req.files.coverImage[0].path
    }
     if(!(avatarlocal)){
        throw new apierror("avatar dal jaldi",400)
    }
    const avatarfile = await uploadCloudinary(avatarlocal) //upload cloudinary
    const coverfile = await uploadCloudinary(coverlocal)

    if(!avatarfile){
            throw new apierror("avatar dal jaldi",400)

    }
   const user = await User.create({  //create a user 
        fullname,
        avatar: avatarfile.url,
        coverImage: coverfile?.url || "",//cloudnary gives full object we just want url
        email,
        password,
        username: username.toLowerCase()
    })
    const createuser = await User.findById(user._id).select("-password -refreshToken") // thsi is final of user

    if(!createuser){
        throw new apierror("something went wrong",500)
    }

    return res.status(201).json(
        new apiresponse("successfully created", 202 , createuser)
    )
})

export { register }