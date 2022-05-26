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


/*
This middleware is only intended to be used in a development environment
as the full error stack traces and internal details of any object passed 
to this module will be sent back to the client when an error occurs.
When an object is provided to Express as an error, this module will display as much about this object 
as possible, and will do so by using content negotiation for the response between HTML, JSON, and plain text.


*/