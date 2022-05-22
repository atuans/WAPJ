// before logged in, must pass through this middleware
const ErrorHandle = require('../utils/ErrorHandle');
const catchAsyncError = require('./catchAsyncError')
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')



exports.isAuthenticatedUser = catchAsyncError(async(req,res, next)=>{
   
    const {token}  = req.cookies; // cookie of each user, token is the JsonWebToken string, in this case become a object
    // jsonwbetoken already a object

    if(!token){
        return next(new ErrorHandle("Please login to access this resource",401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    //jwt.verify(token, secretOrPublicKey, [options, callback])   

   req.user =  await User.findById(decodedData.id)

   next();

})

exports.authorizeRoles = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next(
                new ErrorHandle(
                `Role: ${req.user.role} is not allowed to access this resource`,403
            ));
        }
        next();
    };
}





/*
Assuming the request contained a cookie named "chocolatechip" with value "Yummy:
req.cookies.chocolatechip;
// "Yummy"

*/