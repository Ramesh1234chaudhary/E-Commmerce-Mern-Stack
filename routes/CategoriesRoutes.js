const express = require('express');
const { requiresignIn, isAdmin } = require('../middleware/Authmiddeware');
const { CreateCategorController,UpdateCategorController ,GetCategorController,GetSingleCategorController,DeleteCategorController} = require('../controller/CategoryController');

const router=express.Router()

router.post('/create-category', requiresignIn, isAdmin,CreateCategorController)
router.put('/update-category/:id', requiresignIn, isAdmin, UpdateCategorController);
router.get('/getAllcategory', GetCategorController);
router.get('/getSinglecategory/:slug', GetSingleCategorController);
router.delete('/delete-category/:id',requiresignIn, isAdmin, DeleteCategorController);

 

module.exports = router;
