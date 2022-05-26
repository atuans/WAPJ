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

// create new Reviews, - Update Reviews

exports.createProductReview = catchAsyncError(async(req,res,next)=>{

    const {productId, comment, rating} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating:Number(rating),
        comment,
    }

    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(
        rev => rev.user.toString() === req.user._id.toString()
    );


    if(isReviewed){
        product.reviews.forEach((rev) => {
           if(rev => rev.user.toString() === req.user._id.toString())
            (rev.rating = rating),
            (rev.comment = comment); 
        });

    }
    else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    let avgRating = 0;

    product.reviews.forEach((rev) =>{
        avgRating += rev.rating;
    })

    product.ratings = avgRating/product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success:true,
        
    })
})
// Get all Reviews of product

exports.getProductReviews = catchAsyncError(async(req,res,next) =>{

    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandle(`Product not found`),404);
    }

    res.status(200).json({
        success:true,
        reviews: product.reviews,
    });
});


// delete reviews
exports.deleteReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHandle("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avgRating = 0;
  
    reviews.forEach((rev) => {
      avgRating += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avgRating / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });