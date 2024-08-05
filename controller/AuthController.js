const usermodel = require('../models/userModels');
const { hashPassword, comparePassword } = require('../helper/Authhelper');
const JWT = require('jsonwebtoken');
const orderModel = require('../models/oderModel');

const RegisterController = async (req, res) => {
  try {
    const { name, email, password, phone, address,answer } = req.body;

    // validation
    if (!name) {
      return res.send({ error: 'Name is required' });
    }
    if (!email) {
      return res.send({ error: 'Email is required' });
    }
    if (!password) {
      return res.send({ error: 'Password is required' });
    }
    if (!phone) {
      return res.send({ error: 'Phone is required' });
    }
    if (!address) {
      return res.send({ error: 'Address is required' });
    }

    if (!answer) {
      return res.send({ error: 'Answer is required' });
    }


    const existinguser = await usermodel.findOne({ email });
    if (existinguser) {
      return res.status(200).send({
        success: true,
        message: 'Already registered, please login',
      });
    }

    // register
    const hashedPassword = await hashPassword(password);
    const user = new usermodel({ name, email, phone, address,answer, password: hashedPassword }).save();
    res.status(201).send({
      success: true,
      message: 'User registered successfully',
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'Error in registration',
      err,
    });
  }
};

//login

const loginController= async( req,res)=>{
  try{
    const {email,password}=req.body;
     if(!email ||!password){
      return res.status(404).send({
        success:false,
        message:"invalid password or email"
      })
     }
    const user= await usermodel.findOne({email})
     if(!user){
      return res.status(404).send({
        success:false,
        message:"Email is not registerd"
      })
     }
     const match = await comparePassword(password,user.password)
     if(!match){
      return res.status(201).send({
        success:false,
        message:"password is worng"
      })
  
     }

     //token 

     const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'})
     return res.status(200).send({
      success:true,
      message:"login successfully",
      user:{
        name:user.name,
        email:user.email,
        phone:user.phone,
        address:user.address,
        role:user.role
      },
      token
    })

  }catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'Error in login',
      err,
    });
  }

}
 
//test 

const testController=(req,res)=>{
  res.send("protected route")
}

// forgot-password 

const ForgotpasswordController= async(req,res)=>{

 try{
  const {email,answer, newPassword} =req.body 

  if (!answer) {
    return res.send({ error: 'answer is required' });
  }
  if (!email) {
    return res.send({ error: 'Email is required' });
  }
  if (!newPassword) {
    return res.send({ error: 'newPassword is required' });
  }


   const user = await usermodel.findOne({email,answer})
   if(!user){
    return res.status(404).send({
      status:false,
       message:'wrong email or answer'
    })
   }
    const hashed= await hashPassword(newPassword)

    await usermodel.findByIdAndUpdate(user.id,{password:hashed})
  res.status(200).send({
    success:true,
    message:'password changed sucessfully'
  })

   

 }catch(err){
  console.log(err);
  res.status(500).send({
    success: false,
    message: 'somhing went wrong',
    err,
  });

 }
}

 const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await  usermodel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await usermodel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders
 const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

 const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
 const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

module.exports = { RegisterController,loginController,testController,ForgotpasswordController ,updateProfileController,getOrdersController,orderStatusController,getAllOrdersController};
