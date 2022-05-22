const ErrorHandle = require('../utils/ErrorHandle');
const User = require('../models/userModel')
const catchAsyncError = require('../middleware/catchAsyncError');
const sendToken = require('../utils/jwtToken');
const crypto = require('crypto')

// User Register

exports.registerUser = catchAsyncError(async (req, res, next) => {    
    
    const { name, email, password } = req.body;
    
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: 'This is a sample id',
            url:'profilePicUrl'
        },

    });
    // const token = user.getJWTToken();
    // res.status(201).json({
    //     success:true,
    //     user,
    //     token,
    // })
    sendToken(user,201,res);
})

// login user
exports.loginUser = catchAsyncError(async(req,res,next)=>{
    const {email, password} = req.body;

    // checking have user fill in placeholder yet
    if(!email || !password){
        return next(new ErrorHandle("Please enter email & password",400))
    }
    const user = await User.findOne({email}).select("+password"); //db.collection.findOne(query, projection)

    if(!user){
        return next(new ErrorHandle("Invalid email or password",401))
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandle("Invalid email or password",401)); // unauthorized error
    }

    // const token = user.getJWTToken();
    // res.status(201).json({
    //     success:true,
    //     user,
    //     token,
    // })    
    sendToken(user, 200, res);
});


//logout user

exports.logoutUser = catchAsyncError(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })

    res.status(200).json({
        success:true,
        message: "You have been logged out",
    });
})


// Forget password

exports.ForgotPassword = catchAsyncError(async(req,res,next)=>{
    
    const user = await User.findOne({
        email: req.body.email
    });

    if(!user){
        return next(new ErrorHandle("user not found",404));
    }

    // get resetPassword token
    const resetToken= user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
})
