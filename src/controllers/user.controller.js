import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    //get user detail from frontend
    //validation
    //check if user exists: username and email
    //check for images,check for avatar images :-m compulsory
    //upload to cloudinary, avatar
    //create user object - create entry in db
    ////remove password and refresh token field from response
    //check for user creation 
    //return response
    const{fullName,email,username,password}= res.body
    console.log("email:", email);


    
    //res.status(200).json({
       //message: "app working"
    //})
})

export {
    registerUser,
}