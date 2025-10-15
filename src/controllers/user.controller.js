import {asyncHandler} from "../utils/asyncHandler.js"

const register = asyncHandler(async (req,res)=>{
    res.send(200).json({
        message: "ok"
    })
})
export {register}