const express=require('express');
const {handleGenerateNewShortURL, handleGetAnalytics}=require('../controllers/url');
const router=express.Router();

router.post('/',handleGenerateNewShortURL);
module.exports=router;

router.get('/analytics/:shortId',handleGetAnalytics);