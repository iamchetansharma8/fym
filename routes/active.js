const express=require('express');
const router=express.Router();
const activeController=require('../controllers/active_controller');

router.get('/show',activeController.showActive);
router.get('/end/:id',activeController.makeInactive);

module.exports=router;