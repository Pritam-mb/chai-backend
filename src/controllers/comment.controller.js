import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/apierror.js"
import {ApiResponse} from "../utils/apiresponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)
    const skip = (pageNumber - 1) * limitNumber
    const comments = await Comment.aggregate([
        {
            $match:{
                video: new mongoose.Types.ObjectId(videoId)
            }
        },{
            $lookup:{
                from:"useres",
                localField:"owner",
                foreignField:"_id",
                as:"ownerDetails",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            fullname:1,
                    }
                }
                ]
            }
        },
        {
            $addFields:{
                owner: {$arrayElemAt:["$ownerDetails",0]}
            }
        },
        {
            $project:{
                ownerDetails:0
            }
        },
        { $skip: skip },
        { $limit: limitNumber }
    ])
    return res.status(200).json(
        new ApiResponse("Comments fetched successfully",200,{
            comments,
            pagination:{
                page: pageNumber,
                limit: limitNumber,
                pages: Math.ceil(comments.length/limitNumber)
            }
        })
    )


})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
     const {videoId} = req.params
    const {content} = req.body
    
    if(!isValidObjectId(videoId)){
        throw new ApiError("Invalid video ID", 400)
    }

    if(!content?.trim()){
        throw new ApiError("Comment content is required", 400)
    }

    // Verify video exists
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError("Video not found", 404)
    }
    await Comment.create({
        content: req.body.content,
        video: req.params.videoId,
        owner: req.user._id
})
    return res.status(200).json(new ApiResponse("Comment added successfully",200,null))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body
    const comment = await Comment.findById(commentId)
    if(!isValidObjectId(commentId)){
        throw new ApiError("Invalid comment ID", 400)
    }   
    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError("You are not authorized to update this comment",403)
    }
    if(!content?.trim()){
        throw new ApiError("Comment content is required", 400)
    }
    await Comment.findByIdAndUpdate(commentId,{
        content: content
    })
    return res.status(200).json(new ApiResponse("Comment updated successfully",200,null))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
        const {commentId} = req.params
     const comment = await Comment.findById(commentId)
     if(!isValidObjectId(commentId)){
         throw new ApiError("Invalid comment ID", 400)
     }   
    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError("You are not authorized to update this comment",403)
    }
    await Comment.findByIdAndDelete(commentId)
    return res.status(200).json(new ApiResponse("Comment deleted successfully",200,null))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }