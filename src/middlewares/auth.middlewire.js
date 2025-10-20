import { asyncHandler } from "../utils/asyncHandler";

export const verifyjwt = asyncHandler(async(req,res,next)=>{
    const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ")[1]
    if(!token){
        throw new apierror("unauthenticated access",401)
    }
})