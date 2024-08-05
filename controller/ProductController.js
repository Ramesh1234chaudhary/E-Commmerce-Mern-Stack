
const Productmodel = require("../models/ProductModels");
const fs =require('fs')
const { default: slugify } = require("slugify");
const categorymodel = require("../models/CategoryModel");
const orderModel = require("../models/oderModel");
const braintree  = require('braintree')
const dotenv = require('dotenv')

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


const CreateProductController = async (req, res) => {
    try {
      const { name, description, price, category, quantity, shipping } = req.fields;
      const { photo } = req.files;
  
      // Validation
      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !price:
          return res.status(500).send({ error: "Price is Required" });
        case !category:
          return res.status(500).send({ error: "Category is Required" });
        case !quantity:
          return res.status(500).send({ error: "Quantity is Required" });
        case !shipping:
          return res.status(500).send({ error: "Shipping is Required" });
        case photo && photo.size > 1000000:
          return res
            .status(500)
            .send({ error: "photo is Required and should be less than 1mb" });
      }
  
      const product = new Productmodel({ ...req.fields, slug: slugify(name) });
      if (photo) {
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
      }
  
      await product.save();
      res.status(201).send({
        success: true,
        message: 'Product created successfully',
        product,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        message: 'Error in creating product',
        err,
      });
    }
  }
  
 const GetProductController=async(req,res) =>{
    try{
 const products= await Productmodel.find({}).populate("category")
 .select("-photo").limit(12)
 .sort({ createdAt: -1 }); 

res.status(201).send({
    success:true,
    message:'All Products',
    products
})
    }catch (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        message: 'Error in getting product',
        err,
      });
    }
 }
 
const GetSingleProductController=async(req,res)=>{
  try{
    
  const product=await Productmodel.findOne({ slug: req.params.slug })
  .select("-photo").populate("category");

  res.status(200).send({
   success: true,
   message: 'Single product List ',
   product
 });
 
  }catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'Error in getting single product',
      err,
    });
  }
}

const photoProductController=async(req ,res)=>{
  try{
    const product=await Productmodel.findById(req.params.pid).select('photo');
    if(product.photo.data){
      res.set('Content-type',product.photo.contentType)
      return res.status(200).send(product.photo.data)
    }
  }catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'Error in getting  photo',
      err,
    });
  }

}

const DeleteProductController=async(req ,res)=>{
  try{
    const product=await Productmodel.findByIdAndDelete(req.params.pid).select('-photo');
      return res.status(200).send({
        success:true,
        message:'Product deleted successfullly'
      })
    
  }catch(err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'Error in deleting  photo',
      err,
    });
  }

}

const UpdateProductController=async(req,res)=>{
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less than 1mb" });
    }

    const product = await Productmodel.findByIdAndUpdate(req.params.pid,{
      ...req.fields, slug:slugify(name)
    },{new:true})
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(201).send({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  }
  catch(err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'Error in updatng  photo',
      err,
    });
  }
}

 const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await Productmodel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

 const productCountController = async (req, res) => {
  try {
    const total = await Productmodel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
 const productListController = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const products = await Productmodel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

const SearchController= async(req,res)=>{
 try{
const {keyword}=req.params 
const resutls = await Productmodel
.find({
  $or: [
    { name: { $regex: keyword, $options: "i" } },
    { description: { $regex: keyword, $options: "i" } },
  ],
})
.select("-photo");
res.json(resutls);

 }catch (error) {
  console.log(error);
  res.status(400).send({
    success: false,
    message: "error in searching ctrl",
    error,
  });
}

 }
 
 const RelatedProductController= async(req,res)=>{
  try {
    const { pid, cid } = req.params;
    const products = await Productmodel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }

 }

  const productCategoryController = async (req, res) => {
  try {
    const category = await categorymodel.findOne({ slug: req.params.slug });
    const products = await Productmodel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

 const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {CreateProductController,GetProductController,GetSingleProductController,photoProductController,DeleteProductController,UpdateProductController,productFiltersController,productCountController,productListController,SearchController,RelatedProductController,productCategoryController,braintreeTokenController,brainTreePaymentController};
