const express = require("express");
const mongoose = require("mongoose")
const shortUrl = require("./models/shortUrls");
require('dotenv').config()
const app = express();
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect(`mongodb+srv://${process.env.mongouser}:${process.env.mongopass}@cluster0.ekfngnu.mongodb.net/test?retryWrites=true&w=majority`,{
    useNewUrlParser : true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.log('Error:', err.message));


app.use(express.urlencoded({extended: true}));


app.get('/',async (req,res)=>{
    
    const surls = await shortUrl.find()
    
    res.render('index',{shorts : surls,});

})


app.post('/shortUrls',async (req,res)=>{
    await shortUrl.create({full:req.body.fullUrl})
    res.redirect('/');


    
})
app.get('/:shorturls',async (req,res)=>{

   const obj= await shortUrl.findOne({short : req.params.shorturls});
   
   if(obj == null)return res.sendStatus(404);
   obj.clicks++;
   obj.save();
   res.redirect(obj.full)


})
app.post('/:delurl',async (req,res)=>{
     await shortUrl.deleteOne({short : req.params.delurl});
    
    res.redirect('/');
})


app.listen(process.env.PORT || 5000);