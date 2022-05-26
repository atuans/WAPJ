const ErrorHandle = require('../utils/ErrorHandle');
const User = require('../models/userModel')
const catchAsyncError = require('../middleware/catchAsyncError');
const sendToken = require('../utils/jwtToken');
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')

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
    //By default, documents are automatically validated before they 
    //are saved to the database. This is to prevent saving an invalid document. 
    //If you want to handle validation manually, and be able to save objects
    // which don't pass validation, you can set validateBeforeSave to false.
    
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
    try {
        await sendEmail({
          email: user.email,
          subject: `Ecommerce Password Recovery`,
          message,
        });
    
        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email} successfully`,
        });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
    
        await user.save({ validateBeforeSave: false });
    
        return next(new ErrorHandle(error.message, 500));
      }

})
// reset password

exports.resetPassword = catchAsyncError(async(req,res,next)=>{
   
   // creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{ $gt: Date.now()},
    });

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandle("Password does not match",400));
    }
     user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
})


// Get User Details
exports.getUserDetails = catchAsyncError(async(req,res,next) =>{

    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    })
})

// change user password

exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
  
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandle("Old password is incorrect", 400));
    }
  
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandle("password does not match", 400));
    }
  
    user.password = req.body.newPassword;
  
    await user.save();
  
    sendToken(user, 200, res);
  });



// Update user profile
exports.updateProfile = catchAsyncError(async(req,res,next)=>{
   
    const newData = {
        name: req.body.name,
        email: req.body.email,
    }
    // mongoose methods
    //findByIdAndUpdate(id, ...) is equivalent to findOneAndUpdate({ _id: id }, ...).
    const user = await User.findByIdAndUpdate(req.user.id,newData,{
        new: true, //  true to return the modified document rather than the original.
        //upsert: bool - creates the object if it doesn't exist. defaults to false.
        runValidators: true, //validate the update operation against the model's schema.
        useFindAndModify: false,
    });
    res.status(200).json({
        success:true,
    })
})

// get all user --admin
exports.getAllUser = catchAsyncError(async(req, res, next)=>{
    
    const users = await User.find(); // all users
    
    res.status(200).json({
        success:true,
        users
    });
});



// get single user --admin
exports.getSingleUser = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.params.id); // single user
   // this id here is mongoDb _id
    if(!user){
        return next(new ErrorHandle(`User does not exist with ID ${req.params.id}`));
    }

    res.status(200).json({
        success:true,
        user,
    })
})

// update user Role (Admin)
exports.updateUserRole = catchAsyncError(async(req,res,next)=>{
   
    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }
  
    const user = await User.findByIdAndUpdate(req.params.id,newData,{
        new: true,
        runValidators: true, 
        useFindAndModify: false,
    });
    res.status(200).json({
        success:true,
    })
})

// delete user (Admin)
exports.deleteUser = catchAsyncError(async(req,res,next)=>{
  
  const user = await User.findById(req.params.id);

  if(!user){
      return next(new ErrorHandle(`User does not exist with id: ${req.params.id}`));
  }

  await user.remove();
    
    res.status(200).json({
        success:true,
        message: 'User deleted',
    })
})