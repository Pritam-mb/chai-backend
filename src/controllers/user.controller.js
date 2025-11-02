import { request, response } from "express"
import {asyncHandler} from "../utils/asyncHandler.js"
import apierror from "../utils/apierror.js";
import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"
import {uploadCloudinary} from "../utils/cloudinary.js"
import { apiresponse } from "../utils/apiresponse.js";
import { upload } from "../middlewares/multer.middlewire.js";
const generatetokens = async (userid) => {
  try {
    console.log("🟩 Generating tokens for user:", userid);

    const user = await User.findById(userid);
    if (!user) {
      console.log("❌ No user found for ID:", userid);
      throw new apierror("User not found", 404);
    }

    console.log("✅ User found:", user.email);

    const accesstoken = user.generateAccessToken();
    const refreshtoken = user.generateRefreshToken();

    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: false });

    console.log("✅ Tokens generated successfully");
    return { accesstoken, refreshtoken };
  } catch (error) {
    console.error("❌ Token generation error:", error);
    throw new apierror("something went wrong", 500);
  }
};

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

const loginuser = asyncHandler(async (req,res)=>{
            //req body
            //username or email
            //find the user
            //password check

            //access and refresh token
            //send cookie
            //response

            const {email,password,username} = req.body

            if(!(username || email)){
                throw new apierror("email or username provide pls",400)
            }
            const user = await User.findOne(
              {  $or: [{email},{username}]
            })

            if(!user){
                throw new apierror("user not exist ", 409)
            }
            
            const ispasswordvalid = await user.ispasswordCorrect(password)
            if(!ispasswordvalid){
                throw new apierror("password incorrect",401)
            }

         const {accesstoken,refreshtoken} = await  generatetokens(user._id)
            // here when we take user it doesnt have refresh token  so we need to fetch again bec it is empty
       
            const loggedinuser = await User.findById(user._id).select("-password -refreshtoken") //here we are fetching the user again to get the refresh token
            const options ={ 
                httpOnly: true, // not accessible from frontend js
                secure: true
            }
            //cookiies are basically stored data like refresh token which help browser to remember if u logged in or not for short term
            return res.status(200)
            .cookie("refreshToken", refreshtoken, options) // we are storing refresh token in cookie so that it is not accessible from frontend
            .cookie("accessToken", accesstoken, options)
            .json(
                new apiresponse("successfully logged in",200,{
                    user: loggedinuser,
                    accesstoken,refreshtoken
                })
            )
})

const logoutuser = asyncHandler(async (req,res)=>{
    // clear cookies
       // here the user came from auth middlewire where we del the tokens from user
   await User.findByIdAndUpdate(
        req.user._id,
        {

            $set: {
                refreshToken: undefined
            },
        },
            {
                new: true
            }
        
    )
      const options ={ 
                httpOnly: true, // not accessible from frontend js
                secure: true
            }
            return res.status(200)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken",options)
            .json(new apiresponse("user logged out",200,{}))
})


// generate new access token using refresh token because access token has short life span
const refreshAcessToken = asyncHandler(async(req,res)=>{
    const incomingtoken = await req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ","")

    if(!incomingtoken){
        throw new apierror("doesnt get cookies",401)
    }

   try { // verify token
    const decodetoken = jwt.verify(incomingtoken,
         process.env.REFRESH_TOKEN_SECRET
     )
     // if(! decodetoken){
     //     throw new apierror("invalid user",402)
     
    const user =await User.findById(decodetoken?._id) // id from mongo 
    if(!user){
     throw new apierror("user not exist",401)
    }
    if( incomingtoken !== user?.refreshToken){
     throw new apierror("session expired",403)
    }
     const options ={ 
                 httpOnly: true, // not accessible from frontend js
                 secure: true
             }
    const {accesstoken,refreshtoken} = await generatetokens(user._id)
    res.status(200)
    .cookie("accessToken",accesstoken,options)
    .cookie("refreshToken",refreshtoken,options)
    .json(
     new apiresponse(200,{ accesstoken,refreshtoken},
         "cookies restored"
     )
    )
   } catch (error) {
    throw new apierror("genaratoke generating failed",404)
   }
})

const changepassword = asyncHandler(async(req,res)=>{
    const {oldpassword , newpassword , confirmpassword} = req.body  // here the old password means the current password of user 
    
    const user = await User.findById(req.user._id)    // before it we call verify jwt which verify the by taking his cookies and then it store all the user details in req.user.. so we can find id from req.user
   const iscorrect = await user.ispasswordCorrect(oldpassword)

   if(!iscorrect){
    throw new apierror("old password incorrect",400)
   }
    if(newpassword !== confirmpassword){
        throw new apierror("password doesnt match",400)
    }

    user.password = newpassword  // we are directly assigning new password to user password bec we have pre save hook in user model which will hash the password before saving
   
    await user.save({ validateBeforeSave: false}) // here we are skipping the validation bec we are only changing the password not other details
   return res.status(200)
   .json(
    new apiresponse("password changed successfully",200,{})
   )

})

const getcurrentuser = asyncHandler(async(req,res)=>{
    return res.statur(200)
    .json(
        new apiresponse("current user fetched",200, req.user)
    )
})

const updateuser = asyncHandler(async(req,res)=>{
    const {fullname,username,email} = req.body
    if(! (fullname || username || email)){
        throw new apierror("provide atleast one field to update",400)
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                fullname: fullname || req.user.fullname,
                username: username || req.user.username,
                email: email || req.user.email
            }
        },
            {new: true}
        
    ).select("-paasword")
    res.status(200).json(
        new apiresponse("user updated successfully",200,user)
    )

})

const avatarupdate = asyncHandler(async (req,res)=>{
    const avatarlocal= req.file?.path //check if avatar exist
    if(!(avatarlocal)){
       throw new apierror("avatar nahi hai tera",400)
   }
   const avatarfile = await uploadCloudinary(avatarlocal)
     if(!avatarfile.url){
           throw new apierror("avatar dal jaldi",400)
        }
   
           const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    avatar : avatarfile.url
                }
            },
        { new: true }
           ).select("-password")
        // const user = await User.findById(req.user._id)
        // user.avatar = avatarfile.url
         
          
    // await user.save({ validateBeforeSave: false})
            return res.status(200).json(    
        new apiresponse("avatar updated successfully",200,user)
    )
})


const coverimgupdate = asyncHandler(async (req,res)=>{
    const avatarlocal= req.file?.path //check if avatar exist
    if(!(avatarlocal)){
       throw new apierror("coverimg nahi hai tera",400)
   }
   const avatarfile = await uploadCloudinary(avatarlocal)
     if(!avatarfile.url){
           throw new apierror("avatar dal jaldi",400)
        }
   
           const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    coverImage : avatarfile.url
                }
            },
        { new: true }
           ).select("-password")
        // const user = await User.findById(req.user._id)
        // user.avatar = avatarfile.url
    // await user.save({ validateBeforeSave: false})
    return res.status(200).json(
        new apiresponse("cover image updated successfully",200,user)
    )

})

export { register, loginuser,logoutuser,refreshAcessToken,changepassword ,getcurrentuser,updateuser, avatarupdate,coverimgupdate}