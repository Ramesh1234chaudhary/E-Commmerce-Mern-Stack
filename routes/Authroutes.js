const express = require('express');
const { RegisterController,loginController, testController,ForgotpasswordController,updateProfileController,getOrdersController,getAllOrdersController ,orderStatusController} = require('../controller/AuthController');
const { requiresignIn ,isAdmin}= require('../middleware/Authmiddeware');

const router = express.Router();

// Register
router.post('/register', RegisterController); 

//LOGIN

router.post('/login',loginController)

//test 

router.get('/test',requiresignIn,isAdmin,testController)

// forgot password 
router.post('/forgot-password', ForgotpasswordController)

// protected routes

router.get('/user-auth', requiresignIn,(req,res)=>{
    res.status(200).send({ok:true})
})

router.get('/admin-auth', requiresignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
  });
  
  router.put("/profile", requiresignIn, updateProfileController);

  //orders
router.get("/orders", requiresignIn, getOrdersController);

//all orders
router.get("/all-orders", requiresignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requiresignIn,
  isAdmin,
  orderStatusController
);



module.exports = router;
