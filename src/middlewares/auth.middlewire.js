import { asyncHandler } from "../utils/asyncHandler";

export const verifyjwt = asyncHandler(async(req,res,next)=>{
    const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ")[1] // getting token from cookies or headers
    if(!token){
        throw new apierror("unauthenticated access",401) // custom error class
    }
})