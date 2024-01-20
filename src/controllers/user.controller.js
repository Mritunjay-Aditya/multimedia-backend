import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
console.log("running user.controller");



const registerUser = asyncHandler(async (req, res) => {
    //get user detail from frontend
    //validation
    //check if user exists: username and email
    //check for images,check for avatar images :-m compulsory
    //upload to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation 
    //return response
    const{fullName, email, username, password }= req.body
    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")
    }
    const exitedUser = await User.findOne({
        $or: [{ username },{ email }]
    })

    if(exitedUser){
        throw new ApiError(409,"User already exists")
    }

    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path; 
    
    //req.files.avatar[0].pathves the access of the fime from the middleware multer.
    //const coverjpgLocalPath = req.files?.coverjpg[0]?.path;
    
    let coverjpgLocalPath;
    if (req.files && Array.isArray(req.files.coverjpg) && req.files.coverjpg.length > 0) {
        coverjpgLocalPath = req.files.coverjpg[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverjpg = await uploadOnCloudinary(coverjpgLocalPath)
    
    

    if(!avatar){
        throw new ApiError(400,"Avatar upload failed")
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverjpg:coverjpg?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"User creation failed")
    }

    return res.status(201).json(new ApiResponse(201,createdUser,"User registered successfully")) 

})
export {
    registerUser,
}