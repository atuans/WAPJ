const express = require('express')
const app = express();
const errorMiddleware = require('./middleware/Error')
const cookieParser = require('cookie-parser')


app.use(express.json())
app.use(cookieParser())

//route imports
const product = require('./routes/productRoute')
const user = require('./routes/userRoutes')

//product
app.use('/api/v1',product)
//user 
app.use('/api/v1',user)
// middleware error import
app.use(errorMiddleware);

module.exports = app;