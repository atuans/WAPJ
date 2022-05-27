const Order = require('../models/orderModel');
const Product = require('../models/productModels');
const ErrorHandle = require('../utils/ErrorHandle');
const catchAsyncError = require('../middleware/catchAsyncError')

// create new Order
exports.newOrder = catchAsyncError(async(req,res,next) =>{
    const {
        ShippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        ShippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice, 
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(200).json({
        success:true,
        order,
    }); 
});


// get single order
exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    // populate work like join in SQL join
    /*
       Story.
            find(...).
            populate('fans').
            populate('author').
    */

    if(!order){
        return next(new ErrorHandle(`Order not found`, 404));
    }
    res.status(200).json({
        success:true,
        order,
    })
})

// get User logged in orders
exports.myOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find({user: req.user._id });

   
    res.status(200).json({
        success:true,
        orders,
    })
})

// get all orders (Admin)

exports.getAllOrders = catchAsyncError(async(req,res,next) =>{
    const orders  = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount = totalAmount + order.totalPrice;
    });
    
    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    })
})

// Update Order Status -- Admin
exports.UpdateOrderStatus = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHandle("Order not found with this Id", 404));
    }
  
    if (order.orderStatus === "Delivered") {
      return next(new ErrorHandle("You have already delivered this order", 400));
    }
  
    if (req.body.status === "Shipped") {
      order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
      });
    }
    order.orderStatus = req.body.status;
  
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
  
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  });

  async function updateStock(id, quantity) {
    const product = await Product.findById(id);
  
    product.Stock -= quantity;
  
    await product.save({ validateBeforeSave: false });
  }

// delete orders (Admin)

exports.deleteOrder = catchAsyncError(async(req,res,next) =>{
    const order  = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandle("Order not found with this Id", 404));   
     }

    await order.remove()
    
    res.status(200).json({
        success:true,
        
    })
})
