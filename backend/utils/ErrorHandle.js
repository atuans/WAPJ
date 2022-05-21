class ErrorHandle extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode

        Error.captureStackTrace(this,this.constructor);

    }
    

}

module.exports = ErrorHandle;

//captureStackTrace returns a string that represents the location 
//of that particular error in the call. It gives us a stack that helps
// us to find the location of that error in the code at which new Error() was Called.
// this will help us to find the exact error in our code.