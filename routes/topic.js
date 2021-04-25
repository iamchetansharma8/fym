const express=require('express');
const router=express.Router();

const topicController=require('../controllers/topic_controller');

router.post('/add/:id',topicController.addOrCreateTopic);

module.exports=router;