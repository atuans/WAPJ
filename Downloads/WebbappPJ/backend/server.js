const app = require('./app');
const dotenv = require('dotenv')
const connectDatabase = require('./config/database')
const cloudinary = require('cloudinary').v2

// handling uncaught exception
process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down sever due to Uncaught Exception`);
    process.exit(1);
});

//configuration
dotenv.config({
    path:'backend/config/config.env'
})

// connecting to database
connectDatabase();

// Cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});




// Server
const server =app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
})
// unhandled Promise Rejection

process.on("unhandledRejection", err =>{
    console.log(`Error: ${err.message}`);
    console.log("Server shutting down due to unhandled Promise Rejection");

    server.close(()=>{
        process.exit(1)
    })
}) 
