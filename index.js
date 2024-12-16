const express=require('express');
const path=require('path');
const {connectToMongoDB}=require("./database/connect");
const urlRoute=require('./routes/url');
const userRoute=require('./routes/user');
const URL =require('./models/url');
// const cors = require('cors'); // Import CORS middleware
const app=express();
// const PORT=8001;
const PORT=process.env.PORT || 8001;

// Enable CORS
// app.use(cors());

connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>{
    console.log('MongoDB connected');
    
})

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

// connectToMongoDB(process.env.MONGO_URL)
// .then(()=>{
//     console.log('MongoDB connected');
    
// })



app.get('/', (req, res) => {
    res.render('home');
});

app.use(express.static('public'));


app.use(express.json());

app.use('/url',urlRoute);
app.use('/user',userRoute);

app.get('/test',async (req,res)=>{
    const allUrls=await URL.find({});
    return res.render("home",{urls:allUrls});
});

app.get('/:shortID', async (req, res) => {
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