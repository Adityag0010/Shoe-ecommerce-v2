import { User } from "../models/model-export.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { OAuth2Client } from 'google-auth-library';

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false}); // dont check anything before save
        return {accessToken , refreshToken}; 
    } catch (error) {
        throw new ApiError(500 , "Something went wrong while generating refresh and access token")
    }
};

export const register = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if(
        [fullName , email , password].some((field) => 
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are compulsory")
    } 

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(400, "User already exists")
    }

    const user = await User.create(
        { 
            fullName,
            email, 
            password
        }
    );

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser) {
        throw new ApiError(500 , "Something went wrong while registering a user");
    }

    return res.status(201)
    .json(
        new ApiResponse(
            200,
            createdUser,
            "User Registered Successfully"
        )
    );
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email) {
        throw new ApiError(400 , "Email is required");
    }

    const user = await User.findOne({ email });

    if(!user) {
        throw new ApiError(404 , "User does not exist");
    }

    const isPasswordVaild = await user.isPasswordCorrect(password);
    
    if (!isPasswordVaild) {
        throw new ApiError(401 , "Invalid User credentails");
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/',     
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
    console.log("User data: " , user);
    res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged In Successfully"
        )
    );
});


export const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
           }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/',     
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
 
    return res.status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(
        new ApiResponse(200 , {} , "User logged Out")
    )
});


export const checkAuth = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json(
      new ApiResponse(401, "Not logged in", { isLoggedIn: false })
    );
  }

  return res.status(200).json(
    new ApiResponse(200, "User is logged in", { isLoggedIn: true, userId: req.user._id })
  );
});

export const googleAuth = asyncHandler(async (req, res) => {
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    const authorizeUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    });
    res.redirect(authorizeUrl);
});

export const googleCallback = asyncHandler(async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.redirect('https://shoeecommercev2.vercel.app/login?error=Google_Auth_Failed');
    }

    try {
        const client = new OAuth2Client(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_REDIRECT_URI
        );

        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                fullName: name,
                email: email,
                password: Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10),
                role: 'customer'
            });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none", // since frontend is usually on a different port during dev
            path: '/',     
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        };

        res.cookie("accessToken", accessToken, options)
           .cookie("refreshToken", refreshToken, options)
           .redirect('https://shoeecommercev2.vercel.app/'); 

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.redirect('https://shoeecommercev2.vercel.app/login?error=Google_Auth_Error');
    }
});