const express = require('express')
const app = express();
const errorMiddleware = require('./middleware/Error')

app.use(express.json())


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