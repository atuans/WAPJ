const ErrorHandle = require('../utils/ErrorHandle');
const User = require('../models/userModel')
const catchAsyncError = require('../middleware/catchAsyncError')

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
    const token = user.getJWTToken();
    res.status(201).json({
        success:true,
        user,
        token,
    })
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

    const token = user.getJWTToken();
    res.status(201).json({
        success:true,
        user,
        token,
    })
});

