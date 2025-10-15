//// wrapper that is used to handle async errors in express routes

// const asyncHandler = (func)=> async (req,res,next)=>{ 
//       // next is used to pass the error to the next middleware
      
//      try {
//         await func(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message || "Internal Server Error",
//         })
//     }
// }

const asyncHandler =( func) =>{
  return  (req,res,next)=>{
        Promise.resolve(func(req,res,next)).catch((error)=> next(error))
    }
}

export { asyncHandler};
// export default asyncHandler;