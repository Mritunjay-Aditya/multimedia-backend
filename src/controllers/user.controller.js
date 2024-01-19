import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

console.log("running user.controller");

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    if ([fullName, email, username, password].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    console.log(req.files);
    const avatarFile = req.files?.avatar?.[0];
    const frontViewFile = req.files?.frontView?.[0];

    if (!avatarFile) {
        throw new ApiError(400, "Avatar file is required");
    }

    let avatar, frontView;

    if (frontViewFile) {
        avatar = await uploadOnCloudinary(avatarFile.path);
        frontView = await uploadOnCloudinary(frontViewFile.path);
    } else {
        avatar = await uploadOnCloudinary(avatarFile.path);
        frontView = { url: "" }; // Set a default value for coverjpg if it's not provided
    }

    if (!avatar || !frontView) {
        throw new ApiError(400, "File upload failed");
    }

    const user = await User.create({
        fullName,
        email,
        avatar: avatar.url,
        frontView: frontView.url,
        username: username.toLowerCase(),
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User creation failed");
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };
 