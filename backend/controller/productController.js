const Product = require('../models/productModels');
const ErrorHandle = require('../utils/ErrorHandle');
const catchAsyncError = require('../middleware/catchAsyncError')
const apiFeatures = require('../utils/apiFeatures')

// create product - Role : Admin
exports.createProduct = catchAsyncError( async (req,res,next)=>{
    
    req.body.user = req.user.id
    
    const product = await Product.create(req.body);

    //send back data to client side
    res.status(201).json({
        success:true,
        product,
    });
}); 


// get all product 
exports.getAllProduct = catchAsyncError( async (req,res) =>{

    const resultPerPage = 5;

    const productCount = await Product.countDocuments();
    //The countDocuments() function is used to count the number of documents that match the filter in a database collection.//

    const ApiFeature = new apiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    //let products = await apiFeatures.query;

    products = await ApiFeature.query;

    res.status(200).json({
        success:true,
        products,

   })
});

// get product details
exports.getProductDetails = catchAsyncError( async(req,res,next) =>{

    // const product =await Product.findById(req.params.id);

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandle('Product not found',404));
        }

    res.status(200).json({
        success:true,
        product,
        productCount,
    })
});


// update product

exports.updateProduct = catchAsyncError( async (req,res,next) =>{
    let product = await Product.findById(req.params.id);

    // if(!product){
    //     return res.status(500).json({
    //         success:false,
    //         message: "Product not found"
    // }
    //}
    if(!product){
        return next(new ErrorHandle('Product not found',404));
        }

    product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new :true,
            runValidators:true,
            useFindAndModify: false
        });

        res.status(200).json({
            success:true,
            product

        })

});


//delete product

exports.deleteProduct = catchAsyncError (async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    // if(!product){
    //     return res.status(500).json({
    //         success:false,
    //         message:"Product not found"
    //     })
    // }

    if(!product){
        return next(new ErrorHandle('Product not found',404));
        }
    await product.remove();

    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
});