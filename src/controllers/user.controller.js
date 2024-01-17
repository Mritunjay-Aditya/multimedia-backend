import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
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
    const{fullName,email,username,password}= req.body
    console.log("email:", email);
    if(
        [fullName,email,username,password].some((field) => field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const exitedUser = await User.findOne({
        $or:[{ username },{ email }]
    })

    if(exitedUser){
        throw new ApiError(409,"User already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;              //req.files.avatar[0].pathves the access of the fime from the middleware multer.
    
    //const coverImageLocalPath=req.files?.coverImage[0]?.path;
    

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }
    const avatar= await uploadOnCloudinary(avatarLocalPath);
    console.log("avatar uploaded to cloudinary");
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    const coverImage= await uploadOnCloudinary(coverImageLocalPath);
    console.log("coverimage uploaded to cloudinary");

    if(!avatar){
        throw new ApiError(500,"Avatar upload failed")
    }

    const user = await User.create({
        fullName,
        email,
        username:username.toLowerCase(),
        password,
        avatar:avatar.url,
        coverImage:coverImage.url,
        //coverImage:coverImage?.url || "",
    })

    const createdUser=await User.findById(user_id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"User creation failed")
    }

    return res.status(201).json(new ApiResponse(201,createdUser,"User registered successfully")) 

})
    //if(fullName ==""){
        
    //    throw new ApiError(400,"Full Name is required")
   // }

    
    //res.status(200).json({
       //message: "app working"
    //})
export {
    registerUser,
}