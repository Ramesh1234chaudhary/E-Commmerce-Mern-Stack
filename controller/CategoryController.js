const { default: slugify } = require("slugify");
const categorymodel = require("../models/CategoryModel");

const CreateCategorController=async(req,res)=>{
 try{
  const {name}=req.body
   if(!name){
    return res.status(401).send({message:'name is reuired'})
   }

   const existingCategory= await categorymodel.findOne({name})
   if(existingCategory){
    return res.status(200).send({
        success:true,
        message:'category Alredy Exist '
    })
   }
  const category = await new categorymodel({name,slug:slugify(name)}).save()

  res.status(200).send({
    success:true,
    message:'new category created',
    category
  })


 }catch(err){
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'err in category ',
      err,
    });
 }
}

const UpdateCategorController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categorymodel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
    res.status(200).send({
      success: true,
      message: 'new category updated',
      category
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'error in updating category',
      err,
    });
  }
};

const GetCategorController=async(req,res)=>{
 try{
 const category=await categorymodel.find({})
 res.status(200).send({
  success: true,
  message: 'All category List ',
  category
});
 
 }catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'error in getting category',
      err,
    });
  }
}

const GetSingleCategorController=async(req,res)=>{
  try{
    const {slug}=req.params
  const category=await categorymodel.findOne({slug})
  res.status(200).send({
   success: true,
   message: 'Single category List ',
   category
 });
  
  }catch (err) {
     console.log(err);
     res.status(500).send({
       success: false,
       message: 'error in getting category',
       err,
     });
   }
 }

 const DeleteCategorController=async(req,res)=>{
   try{
     const {id}=req.params;
     const category=await categorymodel.findByIdAndDelete(id)
     res.status(200).send({
      success: true,
      message: 'delete  category  ',
      category
    });
   
   }catch (err) {
     console.log(err);
     res.status(500).send({
       success: false,
       message: 'error in delete category',
       err,
     });
   }
 
 }

module.exports = {CreateCategorController,UpdateCategorController,GetCategorController,GetSingleCategorController,DeleteCategorController};
