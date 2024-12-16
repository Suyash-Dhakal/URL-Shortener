const shortid = require('shortid');
const URL=require('../models/url');
async function handleGenerateNewShortURL(req,res){
    const body = req.body;

    if(!body){
        return res.status(400).json({error:"URL is required"});
    }
    const shortId=shortid();
    await URL.create({
        shortID:shortId,
        redirectURL:body.url,
        visitHistory:[],
    });

    return res.json({id:shortId});
}

async function handleGetAnalytics(req,res) {
    const shortID=req.params.shortId; 
    const result=await URL.findOne({shortID});
    return res.json({totalClicks:result.visitHistory.length,
        analytics:result.visitHistory
    })
}

module.exports={
    handleGenerateNewShortURL,
    handleGetAnalytics
};