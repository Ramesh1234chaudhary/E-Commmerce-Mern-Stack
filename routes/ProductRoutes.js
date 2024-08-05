const express = require('express');
const { requiresignIn, isAdmin } = require('../middleware/Authmiddeware');
const { CreateProductController,GetProductController,GetSingleProductController,photoProductController,DeleteProductController,UpdateProductController,productFiltersController,productCountController,productListController, SearchController,RelatedProductController,productCategoryController,braintreeTokenController, brainTreePaymentController} = require('../controller/ProductController');
const ExpressFormidable = require('express-formidable');

const router=express.Router()

router.post('/create-Product', requiresignIn, isAdmin, ExpressFormidable() ,CreateProductController)
router.get('/get-Product', GetProductController);
router.get('/getSingleProduct/:slug', GetSingleProductController);
 router.delete('/delete-product/:pid', DeleteProductController)
router.get('/prodct-photo/:pid',photoProductController)
router.put('/update-Product/:pid', requiresignIn, isAdmin, ExpressFormidable() ,UpdateProductController)
router.post("/product-filters", productFiltersController);
router.get("/product-count", productCountController);
router.get("/search/:keyword", SearchController);
router.get("/search/:keyword", SearchController);
router.get("/related-product/:pid/:cid", RelatedProductController);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

router.get("/product-category/:slug", productCategoryController);


//product per page
router.get("/product-list/:page", productListController);
//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requiresignIn, brainTreePaymentController);


module.exports = router;
