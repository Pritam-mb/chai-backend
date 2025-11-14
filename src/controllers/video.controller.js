import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {apiresponse} from "../utils/apiresponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
// import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {uploadCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if (!(title && description)) {
        throw new Error("Title and Description are required")
    }
    const video = req.files?.videoFile[0]?.path

    if (!(video)) {
        throw new Error("Video file and thumbnail are required")
    }
    let thumbnail;
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {  //check if cover image exist by checking array length
        thumbnail = req.files.thumbnail[0].path
    }

    const videopath = await uploadOnCloudinary(video)
    const thumbnailpath = await uploadOnCloudinary(thumbnail)

    const newvideo = await Video.create({
        videoFile: videopath,
        thumbnail: thumbnailpath,
        title,
        description,
        owner: req.user._id
    })
    await newvideo.save()
    return res.status(201).json(new apiresponse("Video published successfully", 201, newvideo))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new Error("Invalid video ID")
    }
    return res.status(200).json(new apiresponse("Video fetched successfully", 200, req.video))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}