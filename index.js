const express=require('express');
const cookieParser=require('cookie-parser');
const path=require('path');
const {connectToMongoDB}=require("./database/connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const urlRoute=require('./routes/url');
const userRoute=require('./routes/user');
const staticRoute=require('./routes/staticRouter')
const URL =require('./models/url');
// const cors = require('cors'); // Import CORS middleware
const app=express();

const PORT=process.env.PORT || 8001;



connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>{
    console.log('MongoDB connected');
    
})

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));





app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use('/url',restrictToLoggedinUserOnly,urlRoute);
app.use('/user',userRoute);
app.use('/',checkAuth,staticRoute);


app.get('/url/:shortID', async (req, res) => {
    const shortID = req.params.shortID; // Match route parameter and DB field name
    console.log(`Received shortID: ${shortID}`);

    try {
        const entry = await URL.findOneAndUpdate(
            { shortID }, // Match the database field name
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { new: true } // Return the updated document
        );

        if (!entry) {
            console.log('Short URL not found');
            return res.status(404).json({ error: 'Short URL not found' });
        }

        console.log(`Redirecting to: ${entry.redirectURL}`);
        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT,()=>{console.log(`Server started at PORT:${PORT}`);
})